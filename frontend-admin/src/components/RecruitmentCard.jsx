import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography
} from '@mui/material'
import { Link } from 'react-router-dom'

const RecruitmentCard = ({ recruitment }) => {
  return (
    <Card>
      <CardActionArea component={Link} to={`/recruitment/${recruitment.id}`}>
        <CardHeader
          title={recruitment.title}
          subheader={(new Date(recruitment.createdAt)).toLocaleDateString()}
        />
        <CardContent>
          <Typography variant='body1'>
            {recruitment.intro}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default RecruitmentCard