import {
  Box,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'

const SearchBar = () => {
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSearch = (event) => {
    event.preventDefault()
    console.log('searching', search)
    const newParams = new URLSearchParams(searchParams)
    newParams.set('search', search)
    newParams.set('page', 1)
    setSearchParams(newParams)
  }

  return (
    <Box component="form" sx={{ m: 1, display: 'flex', alignItems: 'center' }} onSubmit={handleSearch}>
      <FormControl fullWidth variant='standard'>
        <InputLabel htmlFor="search">搜索</InputLabel>
        <Input
          id="article-search"
          type='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onReset={() => {
            setSearch('')
            const newParams = new URLSearchParams(searchParams)
            newParams.delete('search')
            newParams.set('page', 1)
            setSearchParams(newParams)
          }}  
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

export default SearchBar