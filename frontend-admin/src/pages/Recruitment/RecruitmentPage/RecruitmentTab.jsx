import { Container, Paper, Typography } from '@mui/material'

import JobCard from './JobCard'

const JobsTab = ({ recruitment }) => {
  const jobs = recruitment.jobs
  return (
    <div>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant='h6'> {recruitment.title} </Typography>
        <Typography variant='body1'> {recruitment.intro} </Typography>
      </Paper>
      {jobs.length > 0
        ? (<div>
          {jobs.map(j =>
            (<JobCard job={j} key={j.id} recruitmentId={recruitment.id}/>)
          )}
        </div>)
        : (<Container>暂无岗位</Container>)}
    </div>
  )
}

export default JobsTab