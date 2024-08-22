import { Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Checkbox, 
  Typography,
  Box,
  Divider } from '@mui/material'
import { useState } from 'react'
import { setNotification } from '../reducers/notification'

const typeName = {
  law: '法律条文',
  policy: '政策文件',
  activity: '活动通知',
}

const ArticleCard = ({ article }) => {
  const [checked, setChecked] = useState(false)
  const handleClickCard = () => {
    console.log('click card')
  }

  const handleCheck = (event) => {
    setChecked(event.target.checked)
  }

  return (
    <Card className="article-card" sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, cursor: 'pointer' }}>
        <CardActionArea onClick={handleClickCard}>
          {/* <CardHeader  title={article.title} subheader={article.abstra}  /> */}
          <CardContent>
            <Typography variant="h5" component="h2">
              {article.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexDirection: 'column' }}>
              <Typography
                variant="body2"
                component="p"
              >
                {typeName[article.type]}
              </Typography>
            </Box>
            <Typography variant="body2"  color="textSecondary" component="p">
              {article.author}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {article.abstract}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ ml: 10 }}>
        <Typography variant="body2" color="textSecondary" component="p">
          设为公告
        </Typography>
        <Checkbox checked={checked} onChange={handleCheck} />
      </Box>
    </Card>

  )
}

export default ArticleCard