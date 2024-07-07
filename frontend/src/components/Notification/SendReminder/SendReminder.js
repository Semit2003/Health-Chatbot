import React, { useState, useEffect } from 'react'
import { TextField, Button, Typography, Grid } from '@mui/material'
import notificationService from '../../../services/Notification/notificationService'
import websocketService from '../../../services/websocketService'
import './SendReminder.module.css'

const SendReminder = () => {
  const [appointmentId, setAppointmentId] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [notificationType, setNotificationType] = useState('email')
  const [message, setMessage] = useState('')

  useEffect(() => {
    websocketService.connect('reminderUser') // to be replaced by actual user ID or role if needed

    websocketService.socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data)
      setMessage(receivedMessage.message)
    }

    return () => {
      websocketService.disconnect()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const reminderData = {
        appointmentId,
        contactInfo,
        notificationType,
      }
      const result = await notificationService.sendReminder(reminderData)
      setMessage(result.message)
      websocketService.sendMessage({
        type: 'REMINDER_SENT',
        appointmentId,
        contactInfo,
        notificationType,
      })
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending reminder')
    }
  }

  return (
    <div className="send-reminder">
      <Typography variant="h4">Send Reminder</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Appointment ID"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact Info"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notification Type"
              select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              required
              SelectProps={{
                native: true,
              }}
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </TextField>
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="send-button"
        >
          Send Reminder
        </Button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  )
}

export default SendReminder