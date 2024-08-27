import {
  Paper,
  Typography
} from '@mui/material'

const JobCard = ({ job }) => {
  return (
    <Paper>
      <Typography variant='h6'> {job.name} </Typography>
      <Typography variant='body1'> {job.intro} </Typography>
      <Typography variant='body1'> 薪资：{job.lowerBound} ~ {job.upperBound} </Typography>
    </Paper>
  )
}

export default JobCard