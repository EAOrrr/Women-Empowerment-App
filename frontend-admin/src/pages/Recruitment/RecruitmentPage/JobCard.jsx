import {
  Box,
  Divider,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button

} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { useDeleteRecruitmentJobMutation } from '../../../services/recruitmentsApi'
import { useDispatch } from 'react-redux'
import { createNotification, setNotification } from '../../../reducers/notificationReducer'

const JobCard = ({ recruitmentId, job }) => {
  const dispatch = useDispatch()
  const [ dialogOpen, setDialogOpen ] = useState(false)
  const [ deleteJob ] = useDeleteRecruitmentJobMutation()

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }
  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleConfirm = () => {
    dispatch(setNotification({ message: '删除中...', severity: 'info' }))
    deleteJob({ id: recruitmentId, jobId: job.id })
      .unwrap()
      .then(() => {
        // console.log('delete job success')
        dispatch(createNotification(`删除文章${job.name}成功`, 'success'))
        setDialogOpen(false)
      })
      .catch((error) => {
        // console.error('delete job failed', error)
        dispatch(createNotification(`删除${job.name}失败`, 'error'))
        setDialogOpen(false)
      })
  }

  const ConfirmDialog = () => (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          确认删除岗位 {job.name}？
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleConfirm} autoFocus>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <div>
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, cursor: 'pointer' }} fontFamily='Noto Serif SC'>

          <Box >
            <Typography variant='h6'> {job.name} </Typography>
            <Typography variant='body1'> {job.intro} </Typography>
            <Typography variant='body1'> 薪资：{job.lowerBound} ~ {job.upperBound} </Typography>
          </Box>
        </Box>
        <Divider orientation='vertical' flexItem/>
        <Box sx={{ ml: 10 }} >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant='body2' color='textSecondary' component='p'>
            删除文章
            </Typography>
            <IconButton onClick={handleOpenDialog}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
      <ConfirmDialog />
    </div>
  )
}

export default JobCard