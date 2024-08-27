import { Box, Button, TextField } from "@mui/material";
import { useField } from "../hooks";

const JobForm = ({handleSubmit}) => {
  const name = useField('岗位名称')
  const intro = useField('岗位简介')
  const lowerBound = useField('薪资下限')
  const upperBound = useField('薪资上限')
  const onSubmit = (event) => {
    event.preventDefault()
    // console.log('submit')
    handleSubmit({
      name: name.value,
      intro: intro.value,
      lowerBound: lowerBound.value,
      upperBound: upperBound.value
    })
  }
  return (
    <Box component='form' onSubmit={onSubmit}>
      <TextField  {...name} fullWidth/>
      <TextField  {...intro} fullWidth/>
      <TextField  {...lowerBound} fullWidth/>
      <TextField  {...upperBound} fullWidth/>
      <Button type='submit' color='primary' variant='contained' fullWidth>提交</Button>
    </Box>
  );
}
export default JobForm;

