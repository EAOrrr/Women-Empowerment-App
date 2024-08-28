import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CardActionArea,
  Box
} from '@mui/material'

import VisibilityIcon from '@mui/icons-material/Visibility'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'

import { Link } from 'react-router-dom'

const statuses = {
  'in progress': {
    color: 'success.light',
    text: '进行中'
  },
  'done': {
    color: 'error.light',
    text: '已完成'
  },
  'answered': {
    color: 'warning.light',
    text: '已回答'
  },
}

const PostCard = ({ post }) => {
  const createdDate = new Date(post.createdAt)
  const updatedDate = new Date(post.updatedAt)
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center', }}
    >
      <CardActionArea component={Link} to={`/posts/${post.id}`} sx={{ height: 150 }}>
        <CardContent fontFamily='Noto Serif SC'>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection:'row' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, }}>
              <Typography variant='h6' fontFamily='Noto Serif SC'>
                {post.title}
              </Typography>
              <Typography variant='body1' fontFamily='Noto Serif SC'>
                {post.content}
              </Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}> */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, // Add margin bottom to create space below status
                  py: 0.5, 
                  px: 1, 
                  border: '1px solid', 
                  borderColor: (statuses[post.status]).color, 
                  borderRadius: 0, 
                  // backgroundColor: 'secondary.light',
                  color: (statuses[post.status]).color,
                  textAlign: 'center',
                  fontFamily: 'Noto Serif SC',
                }}
              >
                {statuses[post.status].text}
              </Typography>
            <Typography variant='body1' fontFamily='Noto Serif SC'>
            总回复数：{post.numberOfComments}
            </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexDirection: 'column' }}>
            <Typography variant='body2' fontFamily='Noto Serif SC'>
              创建时间: {createdDate.toLocaleString()}
            </Typography>
            <Typography variant='body2' fontFamily='Noto Serif SC'>
              更新时间: {updatedDate.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" fontFamily='Noto Serif SC'>
              <VisibilityIcon fontSize='small' />{post.views}       <ThumbUpIcon fontSize='small'/>{post.likes}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default PostCard