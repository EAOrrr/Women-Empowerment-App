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

const PostCard = ({ post }) => {
  console.log(post)
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
            <Typography variant='body1' fontFamily='Noto Serif SC'>
            总回复数：{post.numberOfComments}
            </Typography>
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