import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useDeleteRecruitmentMutation } from '../../../services/recruitmentsApi'
import { createNotification, setNotification } from '../../../reducers/notificationReducer'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

const RecruitmentCard = ({ recruitment }) => {
  const dispatch = useDispatch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteRecruitment, ] = useDeleteRecruitmentMutation()
  const handleOpenDialog = () => {
    setDialogOpen(true)
  }
  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleConfirm = () => {
    dispatch(setNotification({ message: '删除中...', severity: 'info' }))
    deleteRecruitment(recruitment.id)
      .unwrap()
      .then(() => {
        dispatch(createNotification(`删除招聘${recruitment.title}成功`, 'success'))
        setDialogOpen(false)
      })
      .catch((error) => {
        dispatch(createNotification(`删除招聘${recruitment.title}失败`, 'error'))
        setDialogOpen(false)
      })
  }

  const ConfirmDialog = () => (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          确认删除企业 {recruitment.name} 的招聘 {recruitment.title} ？
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleConfirm}>确认</Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <>
      <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, cursor: 'pointer' }} fontFamily='Noto Serif SC'>

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
        </Box>
        <Divider orientation='vertical' flexItem/>
        <Box sx={{ ml: 10 }} >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant='body2' color='textSecondary' component='p'>
          删除招聘
            </Typography>
            <IconButton onClick={handleOpenDialog}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>
      <ConfirmDialog />
    </>
  )
}

export default RecruitmentCard