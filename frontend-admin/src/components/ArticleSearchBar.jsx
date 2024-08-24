import {
  TextField,
  Box,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'

const ArticleSearchBar = () => {
  const navigate = useNavigate()
  const search = useField('搜索', 'search')

  const handleSearch = (event) => {
    event.preventDefault()
    console.log('searching', search.value )
    // navigate('/articles', { search: `?search=${search.value}` })
  }


  return (
    <Box component="form" sx={{ m: 1, display: 'flex', alignItems: 'center' }} onSubmit={handleSearch}>
      <FormControl fullWidth variant='standard'>
        <InputLabel htmlFor="search">搜索</InputLabel>
        <Input
          id="article-search"
          {...search}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </FormControl>
      <Button type='submit' variant='contained' sx={{ ml: 1 }}>
        搜索
      </Button>
    </Box>
  )
}

export default ArticleSearchBar