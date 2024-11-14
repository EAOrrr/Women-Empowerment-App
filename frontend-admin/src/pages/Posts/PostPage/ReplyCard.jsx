import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material'

const ReplyCard = ({ reply }) => {
  return (
    <Card id={`comment-${reply.id}`}>
      <CardContent>
        <Box sx={{ mt:1, ml:1, display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent: 'flex-start' }}>
          <Avatar sx={{ width: 24, height: 24 }} aria-label="recipe">
            {reply.commenter.username[0]}
          </Avatar>
          <Typography variant="body2" sx={{ ml: 1 }}>{reply.commenter.username}</Typography>
        </Box>
        <Box sx={{ p: 1 }} >
          <Typography variant="body1">{reply.content}</Typography>
          <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }} variant="caption">{new Date(reply.createdAt).toLocaleString()}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ReplyCard