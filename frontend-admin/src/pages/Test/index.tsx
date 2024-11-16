import type { EditorOptions } from "@tiptap/core";

import { insertImages, RichTextEditorProvider, RichTextField } from 'mui-tiptap'
import {
  LinkBubbleMenu,
  TableBubbleMenu,
} from 'mui-tiptap'
import React, { useCallback } from 'react'

import { Button } from '@mui/material'
import axios from 'axios'
import { useEditor } from '@tiptap/react'

import EditorMenuControls from './EditorMenuControls'
import useExtensions from "./useExtensions";

const Editor = (): React.JSX.Element => {
  const extensions = useExtensions({
    placeholder: "输入文章内容……",
  });
  let tempImageIds = new Set();

  // 页面加载时恢复未提交的图片 ID
  window.addEventListener('load', () => {
    const storedImageIds = JSON.parse(sessionStorage.getItem('tempImageIds') || '[]');
    tempImageIds = new Set(storedImageIds);
  });

  window.addEventListener('beforeunload', (event) => {
    // 如果有未提交的图片，则显示提醒
    if (tempImageIds.size > 0) {
      event.preventDefault();
      event.returnValue = '您有未保存的更改，确定要离开吗？';
    }
  });

  window.addEventListener('unload', () => {
    const storedImageIds = JSON.parse(sessionStorage.getItem('tempImageIds') || '[]');
    const token = sessionStorage.getItem('token');
    console.log(storedImageIds);
    const payload = JSON.stringify({
      imageIds: storedImageIds,
      token: token
    });
    if (storedImageIds.length > 0) {
      // 使用 `sendBeacon` 发送删除请求
      navigator.sendBeacon('/api/upload/images/deletebatch', payload);

      // 清除 sessionStorage 中的图片 ID
      sessionStorage.removeItem('tempImageIds');
    }
  });

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
            // 使用 axios 上传图片
            const response = await axios.post('/api/upload/images/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            // 假设后端返回 { url, id }
            const data = response.data;

            // 上传成功后返回图片信息
            return {
              src: data.imageUrl,
              alt: file.name,
              imageId: data.imageId, // 假设图片ID由后端返回
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
        images: validImages as Array<{ src: string; alt: string; isCover: boolean; imageId: string }>,
        // editor: rteRef.current.editor,
        editor: editor,
        position: insertPosition,
      });
      // imagesArray.push(...validImages.map(image => image.imageId));
      validImages.forEach(image => tempImageIds.add(image.imageId));
      sessionStorage.setItem('tempImageIds', JSON.stringify([...tempImageIds]));
      console.log(sessionStorage.getItem('tempImageIds'));
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
      content: "<p>Hello <b>world</b>!</p>",
      editorProps: {
        handleDrop: handleDrop,
        handlePaste: handlePaste,
      }
    });


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
    

}

export default Editor