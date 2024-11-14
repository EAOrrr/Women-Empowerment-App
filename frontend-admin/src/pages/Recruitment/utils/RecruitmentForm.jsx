import { Box, Button, Grid, TextField } from '@mui/material'
import { useField } from '../../../hooks'
const RecruitmentForm = ({ handleSubmit , recruitment }) => {
  const title = useField('标题', 'text', recruitment && recruitment.title)
  const name = useField('企业名称', 'text', recruitment && recruitment.name)
  const intro = useField('企业简介', 'text', recruitment && recruitment.intro)
  const province = useField('省份', 'text', recruitment && recruitment.province)
  const city = useField('城市', 'text', recruitment && recruitment.city)
  const district = useField('区县', 'text', recruitment && recruitment.district)
  const address = useField('企业地址', 'text', recruitment && recruitment.address)
  const street = useField('街道', 'text', recruitment && recruitment.street)
  const phone = useField('联系电话', 'text', recruitment && recruitment.phone)

  const onSubmit = (event) => {
    event.preventDefault()
    handleSubmit({
      title: title.value,
      name: name.value,
      intro: intro.value,
      province: province.value,
      city: city.value,
      district: district.value,
      street: street.value,
      address: address.value,
      phone: phone.value
    })
  }

  return (
    <Box component='form' onSubmit={onSubmit} >
      <h1>企业信息注册</h1>
      <TextField {...name} fullWidth required/>
      <Grid container >
        <Grid item xs={3}>
          <TextField {...province} fullWidth required/>
        </Grid>
        <Grid item xs={3}>
          <TextField {...city} fullWidth required/>
        </Grid>
        <Grid item xs={3}>
          <TextField {...district} fullWidth required/>
        </Grid>
        <Grid item xs={3}>
          <TextField {...street} fullWidth required/>
        </Grid>
      </Grid>
      <TextField {...address} fullWidth required/>
      <TextField {...phone} fullWidth required/>
      <TextField {...title} fullWidth required/>
      <TextField {...intro} fullWidth multiline rows={8} required/>
      <Button type='submit' variant='contained' color='primary' fullWidth>提交</Button>
    </Box>
  )
}

export default RecruitmentForm