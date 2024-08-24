import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

const Selector = ({ label, value, options, handleChange, defaultValue, variant='outlined', sx, fullWidth}) => {
  // console.log('label: ', fullwidth)
  return (

    <TextField
      id="outlined-select-currency"
      select
      label={label}
      valud={value}
      variant={variant}
      onChange={handleChange}
      defaultValue={defaultValue}
      fullWidth={fullWidth}
      sx={sx}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default Selector