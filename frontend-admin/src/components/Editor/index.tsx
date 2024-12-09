import React, { useCallback, useEffect } from 'react'
import { Editor as TiptapEditor } from '@tiptap/react'
import { Transaction } from '@tiptap/pm/state';



import type { EditorOptions } from "@tiptap/core";

import { insertImages, RichTextEditorProvider, RichTextField } from 'mui-tiptap'
import {
  LinkBubbleMenu,
  TableBubbleMenu,
} from 'mui-tiptap'

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

// type OnContentChange = (editor: TiptapEditor, transaction: Transaction) => void;
type OnContentChange = (props: { editor: TiptapEditor; transaction: Transaction }) => void;

const Editor = React.forwardRef(({ content, onContentChange }:
   {content: string, onContentChange: OnContentChange }, ref): React.JSX.Element => {
  const [tempImageIds, setTempImageIds] = React.useState<string[]>([]);
  const [initialImageIds, setInitialImageIds] = React.useState<string[]>([]);

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
      console.log(files)
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
      
      onUpdate: onContentChange,
    });


    useEffect(() => {
      const initialImages = extractImageIdsUsingDOM(content);
      setInitialImageIds(initialImages.filter((id): id is string => id !== undefined));
      console.log('initialImages:', initialImages);
    }, [content]);



    React.useImperativeHandle(ref, () => ({
      getContent: () => editor?.getHTML() || '',
      getImages: () => editor?.getJSON()?.content?.filter((node) => node?.type === 'image').map(image => image?.attrs?.id) || [],
      cleanUpTempImages: async () => {
        // tempImageIds.clear();
        const imageIds = editor?.getJSON()?.content?.filter((node) => node?.type === 'image').map(image => image?.attrs?.id) || [];
        // const imagesToDelete = images.filter((image) => image?.attrs && tempImageIds.has(image.attrs.imageId));
        const imagesToDeleteIds = tempImageIds.concat(initialImageIds).filter((imageId) => !imageIds.some((id) => id === imageId));
        await imagesService.deleteBatch({imageIds: imagesToDeleteIds});
        setTempImageIds([]);
        sessionStorage.removeItem('tempImageIds');
      },
      getTempImageIds: () => tempImageIds,
    })
    )

    return (
      <div>
        <RichTextEditorProvider editor={editor}>
          <RichTextField
            controls={<EditorMenuControls handleUploadFiles={handleNewImageFiles}/>}
          />
          <LinkBubbleMenu />
          <TableBubbleMenu />
        </RichTextEditorProvider>
      </div>
    )
    

});

export default Editor