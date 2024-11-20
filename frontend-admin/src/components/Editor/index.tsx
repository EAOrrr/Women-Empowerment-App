import React, { useCallback, useEffect } from 'react'
import type {
  unstable_Blocker as Blocker,
  unstable_BlockerFunction as BlockerFunction,
} from "react-router-dom";
import {
  useBlocker
} from 'react-router-dom'


import type { EditorOptions } from "@tiptap/core";

import { insertImages, RichTextEditorProvider, RichTextField } from 'mui-tiptap'
import {
  LinkBubbleMenu,
  TableBubbleMenu,
} from 'mui-tiptap'

import { Button } from '@mui/material'
import { useEditor } from '@tiptap/react'

import imagesService from '../../services/images'

import EditorMenuControls from './EditorMenuControls'
import useExtensions from "./useExtensions";
import storage from "../../services/storage";


function extractImageIdsUsingDOM(content) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const images = doc.querySelectorAll("img[src*='/api/images/']");
  return Array.from(images).map((img) => {
    const src = img.getAttribute('src');
    return src?.split('/api/images/')[1]; // 提取 `id`
  });
}

const Editor = React.forwardRef(({ content}: {content: string }, ref): React.JSX.Element => {
  const [tempImageIds, setTempImageIds] = React.useState<string[]>([]);
  const [initialImageIds, setInitialImageIds] = React.useState<string[]>([]);
  const [confirming, setConfirming] = React.useState<boolean>(false);

  const blocker = useBlocker(() => tempImageIds.length > 0);

  useEffect(() => {
      if (blocker.state === 'blocked' && !confirming) {
        const leaveConfirm = window.confirm('您有未保存的更改，确定要离开吗？');
        if (leaveConfirm) {
          setConfirming(true);  // 设置正在确认状态
          imagesService.deleteBatch({ imageIds: tempImageIds })
            .then(() => {
              blocker.proceed();  // 确认后继续跳转
              setConfirming(false);  // 重置确认状态
            })
            .catch((error) => {
              console.error("删除图片失败", error);
              setConfirming(false);  // 如果删除失败，也要重置确认状态
            });
        } else {
          blocker.reset();  // 用户取消跳转，重置blocker状态
        }
      }
  }, [blocker.state, confirming, tempImageIds, blocker]);

  const extensions = useExtensions({
    placeholder: "输入文章内容……",
  });

  // 处理上传图片
  function fileListToImageFiles(fileList: FileList): File[] {
    return Array.from(fileList).filter((file) => {
      const mimeType = (file.type || "").toLowerCase();
      return mimeType.startsWith("image/");
    });
  }

  const handleNewImageFiles = useCallback(
    async (files: File[], insertPosition?: number, isCover: boolean = false): Promise<void> => {
      if (!editor) {
        return;
      }
      // 假设上传图片的接口是 POST /api/images
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          // 创建一个FormData对象上传文件
          const formData = new FormData();
          formData.append('image', file);
          try {
            const data = await imagesService.create(formData);

            // 上传成功后返回图片信息
            return {
              src: data.imageUrl,
              alt: file.name,
              id: data.imageId, // 假设图片ID由后端返回
            };
          } catch (error) {
            console.error('上传图片失败:', error);
            return null;
          }
        })
      );

      // 过滤掉上传失败的图片
      const validImages = uploadedImages.filter((image) => image !== null);

      // 插入图片到编辑器
      insertImages({
        images: validImages as Array<{ src: string; alt: string; isCover: boolean; id: string }>,
        // editor: rteRef.current.editor,
        editor: editor,
        position: insertPosition,
      });
      // imagesArray.push(...validImages.map(image => image.imageId));
      const validImageIds = validImages.map(image => image.id)
      setTempImageIds([...tempImageIds, ...validImageIds]);
      sessionStorage.setItem('tempImageIds', JSON.stringify(tempImageIds));
    },
    [],
  );

  // Allow for dropping images into the editor
  const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
    useCallback(
      (view, event, _slice, _moved) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) {
          return false;
        }

        const imageFiles = fileListToImageFiles(event.dataTransfer.files);
        if (imageFiles.length > 0) {
          const insertPosition = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })?.pos;

          handleNewImageFiles(imageFiles, insertPosition);

          // Return true to treat the event as handled. We call preventDefault
          // ourselves for good measure.
          event.preventDefault();
          return true;
        }

        return false;
      },
      [handleNewImageFiles],
    );

    // Allow for pasting images
    const handlePaste: NonNullable<EditorOptions["editorProps"]["handlePaste"]> =
      useCallback(
        (_view, event, _slice) => {
          if (!event.clipboardData) {
            return false;
          }

          const pastedImageFiles = fileListToImageFiles(
            event.clipboardData.files,
          );
          if (pastedImageFiles.length > 0) {
            handleNewImageFiles(pastedImageFiles);
            // Return true to mark the paste event as handled. This can for
            // instance prevent redundant copies of the same image showing up,
            // like if you right-click and copy an image from within the editor
            // (in which case it will be added to the clipboard both as a file and
            // as HTML, which Tiptap would otherwise separately parse.)
            return true;
          }

          // We return false here to allow the standard paste-handler to run.
          return false;
        },
        [handleNewImageFiles],
      );

    const editor = useEditor({
      extensions: extensions,
      content: content,
      editorProps: {
        handleDrop: handleDrop,
        handlePaste: handlePaste,
      },
    });


    window.addEventListener('beforeunload', (event) => {
      const tempImageIdsFromSession = JSON.parse(sessionStorage.getItem('tempImageIds') || '[]');
      // 如果有未提交的图片，则显示提醒
      if (tempImageIdsFromSession.length > 0) {
        console.log('beforeunload', );
        event.preventDefault();
        event.returnValue = '您有未保存的更改，确定要离开吗？';
      }
    });

    window.addEventListener('unload', () => {
      const token = storage.getAccessToken();
      console.log(tempImageIds);
      const payload = JSON.stringify({
        imageIds: tempImageIds,
        token: token
      });
      console.log(payload)
      const tempImageIdsFromSession = JSON.parse(sessionStorage.getItem('tempImageIds') || '[]');
      if (tempImageIdsFromSession.length > 0) {
        // 使用 `sendBeacon` 发送删除请求
        navigator.sendBeacon('/api/images/beacondelete', payload);

      }
    });

    window.addEventListener('popstate', () => {
      console.log('pagehide');
      const storedImageIds = JSON.parse(sessionStorage.getItem('tempImageIds') || '[]');
      const token = storage.getAccessToken();
      // console.log(storedImageIds, token);
      
      if (storedImageIds.length > 0) {
        console.log('Cleaning up unsaved images on pagehide');
        const payload = JSON.stringify({
          imageIds: tempImageIds,
          token: token,
        });

        navigator.sendBeacon('/api/images/beacondelete', payload);

      }
    }, false);

    useEffect(() => {
      const initialImages = extractImageIdsUsingDOM(content);
      setInitialImageIds(initialImages.filter((id): id is string => id !== undefined));
      console.log('initialImages:', initialImages);
    }, [content]);


    // const initialImages = editor?.getJSON()?.content?.filter((node) => node?.type === 'image') || [];

    React.useImperativeHandle(ref, () => ({
      getContent: () => editor?.getHTML() || '',
      getImages: () => editor?.getJSON()?.content?.filter((node) => node?.type === 'image').map(image => image?.attrs?.id) || [],
      cleanUpTempImages: async () => {
        // tempImageIds.clear();
        const imageIds = editor?.getJSON()?.content?.filter((node) => node?.type === 'image').map(image => image?.attrs?.id) || [];
        // const imagesToDelete = images.filter((image) => image?.attrs && tempImageIds.has(image.attrs.imageId));
        console.log('imageIds', imageIds)
        const imagesToDeleteIds = tempImageIds.concat(initialImageIds).filter((imageId) => !imageIds.some((id) => id === imageId));
        console.log('imagesToDeleteIds', imagesToDeleteIds);
        await imagesService.deleteBatch({imageIds: imagesToDeleteIds});
        setTempImageIds([]);
        sessionStorage.removeItem('tempImageIds');
      }
      })
    )
    console.log('tempImageIds:', tempImageIds);

    return (
      <div>
        <RichTextEditorProvider editor={editor}>
          <RichTextField
            controls={<EditorMenuControls handleUploadFiles={handleNewImageFiles}/>}
          />
          <LinkBubbleMenu />
          <TableBubbleMenu />
        </RichTextEditorProvider>
        <Button onClick={() => console.log(editor?.getHTML())}>
          Log HTML
        </Button>
      </div>
    )
    

});

export default Editor