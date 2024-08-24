import { Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Checkbox, 
  Typography,
  Box,
  Divider } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const typeName = {
  law: '法律条文',
  policy: '政策文件',
  activity: '活动通知',
}

const ArticleCard = ({ article }) => {
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)
  const handleClickCard = () => {
    console.log('click card', article.title)
    navigate(`/articles/${article.id}`) 
  }

  const handleCheck = (event) => {
    setChecked(event.target.checked)
  }

  return (
    <Card className="article-card" sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, cursor: 'pointer' }} fontFamily='Noto Serif SC'>
        <CardActionArea onClick={handleClickCard}>
          {/* <CardHeader  title={article.title} subheader={article.abstra}  /> */}
          <CardContent>
            <Typography variant="h5" component="h2" fontFamily='Noto Serif SC'>
              {article.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexDirection: 'column' }}>
              <Typography
                variant="body2"
                component="p"
                fontFamily='Noto Serif SC'
              >
                {typeName[article.type]}
              </Typography>
            </Box>
            <Typography variant="body2"  color="textSecondary" component="p" fontFamily='Noto Serif SC'>
              {article.author}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" fontFamily='Noto Serif SC'>
              {article.abstract}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ ml: 10 }}>
        <Typography variant="body2" color="textSecondary" component="p" >
          设为公告
        </Typography>
        <Checkbox checked={checked} onChange={handleCheck} />
      </Box>
    </Card>

  )
}

export default ArticleCard