import React, { useState } from 'react'
import { TextField, Box, Button } from '@mui/material'
import { useField } from '../hooks'

export default function ExpandableTextField({ label, handleSubmit }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const text = useField(label, 'text')

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleBlur = () => {
    setIsExpanded(false) // 无论是否有内容，失去焦点时都收回
  }

  const onSubmit = (e) => {
    e.preventDefault()
    handleSubmit(text.value)
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 2,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: isExpanded ? 'flex-start' : 'center',
      }}
      onSubmit={onSubmit}
      component='form'
    >
      <TextField
        {...text}
        multiline
        rows={isExpanded ? 6 : 1}
        variant="outlined"
        fullWidth
        placeholder="输入内容..."
        onFocus={handleFocus}
        onBlur={handleBlur}
        sx={{
          transition: 'height 0.3s ease',
        }}
      />
      <Button
        type='submit'
        variant="contained"
        sx={{
          marginLeft: 1,
          alignSelf: 'stretch',  // 确保按钮高度随 TextField 高度变化
          transition: 'height 0.3s ease',
        }}
      >
        发送
      </Button>
    </Box>
  )
}
