import { useState } from 'react'

export const useField = (label, type='text', initialValue, handleChange=null) => {
  const [value, setValue] = useState(initialValue || '')
  const autoComplete = label

  const onChange =  (event) => {
    setValue(event.target.value)
    if (handleChange) {
      handleChange()
    }
  }

  const onReset = () => {
    setValue('')
  }

  return {
    label,
    type,
    value,
    autoComplete,
    onChange,
    onReset
  }
}
