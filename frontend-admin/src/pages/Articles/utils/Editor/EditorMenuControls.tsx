import {
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
  MenuButtonImageUpload,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
  isTouchDevice,
} from 'mui-tiptap'
import React from 'react'


const EditorMenuControls = ({ handleUploadFiles }) => {

  return (
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
      <MenuButtonImageUpload onUploadFiles={handleUploadFiles}/>
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
}

export default EditorMenuControls