import { Button } from '@mui/material'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Text from '@tiptap/extension-text'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'  
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { BulletList } from "@tiptap/extension-bullet-list";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { insertImages, RichTextEditorProvider, RichTextField } from 'mui-tiptap'
import {
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonAddTable,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonEditLink,
  MenuButtonHorizontalRule,
  MenuButtonIndent,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonTaskList,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuButtonUnindent,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
  RichTextEditor,
  TableBubbleMenu,
  isTouchDevice,
  HeadingWithAnchor,
  ResizableImage,
  TableImproved,
  type RichTextEditorRef,
} from 'mui-tiptap'
import React, { useCallback, useRef } from 'react'
import Strike from '@tiptap/extension-strike'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

import axios from 'axios'
import { useEditor } from '@tiptap/react'

const CustomSubscript = Subscript.extend({
  excludes: "superscript",
});

const CustomSuperscript = Superscript.extend({
  excludes: "subscript",
});

const CustomLinkExtension = Link.extend({
  inclusive: false,
});

const extensions = [
  TableImproved.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Text,
  Document,
  Paragraph,
  Bold,
  Italic, 
  Underline,
  // StarterKit,
  Blockquote,
  Heading,
  History,
  CustomSubscript,
  CustomSuperscript,
  Strike,
  // Link,
  LinkBubbleMenuHandler,
  TextAlign.configure({
    types: ["heading", "paragraph", "image"],
  }),
  HorizontalRule,
  OrderedList,
  ListItem,
  TaskItem.configure({
    nested: true
  }),
  TaskList,
  BulletList,
  CustomLinkExtension.configure({
    // autolink is generally useful for changing text into links if they
    // appear to be URLs (like someone types in literally "example.com"),
    // though it comes with the caveat that if you then *remove* the link
    // from the text, and then add a space or newline directly after the
    // text, autolink will turn the text back into a link again. Not ideal,
    // but probably still overall worth having autolink enabled, and that's
    // how a lot of other tools behave as well.
    autolink: true,
    linkOnPaste: true,
    openOnClick: false,
  }),
  ResizableImage,
]

const Editor = (): React.JSX.Element => {
  // const rteRef = useRef<RichTextEditorRef>(null)
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
    // You may want to use a package like attr-accept
    // (https://www.npmjs.com/package/attr-accept) to restrict to certain file
    // types.
    return Array.from(fileList).filter((file) => {
      const mimeType = (file.type || "").toLowerCase();
      return mimeType.startsWith("image/");
    });
  }

  const handleNewImageFiles = useCallback(
    async (files: File[], insertPosition?: number, isCover: boolean = false): Promise<void> => {
      // if (!rteRef.current?.editor) {
      //   return;
      // }
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
        insertPosition,
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


    const Control = (
      <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonUnderline />
            <MenuButtonStrikethrough />
            <MenuButtonSuperscript />
            <MenuButtonSubscript />
            <MenuDivider />
            <MenuButtonEditLink /> 
            <MenuButtonBlockquote />
            <MenuDivider />
            <MenuSelectTextAlign />
            <MenuDivider />
            <MenuButtonBulletedList />
            <MenuButtonOrderedList />
            <MenuButtonTaskList />
            {isTouchDevice() && (
              <>
                <MenuButtonIndent />

                <MenuButtonUnindent />
              </>
            )}
            <MenuDivider />

            <MenuButtonHorizontalRule />
            <MenuButtonAddTable />
            <MenuDivider />
            <MenuButtonUndo />
            <MenuButtonRedo />

            {/* Add more controls of your choosing here */}
          </MenuControlsContainer>
    )

    return (
      <div>
        <RichTextEditorProvider editor={editor}>
          <RichTextField
            controls={Control}
          />
        </RichTextEditorProvider>
        <Button onClick={() => console.log(editor?.getHTML())}>
          Log HTML
        </Button>
      </div>
    )
    
/*
  return (
    <div>
      <RichTextEditor
        ref={rteRef}
        extensions={extensions} // Or any Tiptap extensions you wish!
        content="<p>Hello world</p>" // Initial content for the editor
        editorProps={{
            handleDrop: handleDrop,
            handlePaste: handlePaste,
          }}
        // Optionally include `renderControls` for a menu-bar atop the editor:
        renderControls={() => (
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonUnderline />
            <MenuButtonStrikethrough />
            <MenuButtonSuperscript />
            <MenuButtonSubscript />
            <MenuDivider />
            <MenuButtonEditLink /> 
            <MenuButtonBlockquote />
            <MenuDivider />
            <MenuSelectTextAlign />
            <MenuDivider />
            <MenuButtonBulletedList />
            <MenuButtonOrderedList />
            <MenuButtonTaskList />
            {isTouchDevice() && (
              <>
                <MenuButtonIndent />

                <MenuButtonUnindent />
              </>
            )}
            <MenuDivider />

            <MenuButtonHorizontalRule />
            <MenuButtonAddTable />
            <MenuDivider />
            <MenuButtonUndo />
            <MenuButtonRedo />

            Add more controls of your choosing here
          </MenuControlsContainer>
        )}
      >
      {() => (
            <>
              <LinkBubbleMenu />
              <TableBubbleMenu />
            </>
          )}
      </RichTextEditor>

      <Button onClick={() => console.log(rteRef.current?.editor?.getHTML())}>
        Log HTML
      </Button>
    </div>
  )
  */
}

export default Editor