import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
} from '@mui/material'
import chatService from '../../services/Chat/chatService'
import authService from '../../services/Auth/authService'
import './Chat.module.css'

const Chat = ({ receiverId }) => {
  const [messages, setMessages] = useState([
    { sender: '', receiver: '', message: '', timestamp: '' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const currentUser = authService.getCurrentUser()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await chatService.getMessages(
          currentUser.id,
          receiverId
        )
        setMessages(messages)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [receiverId, currentUser.id])

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return

    const messageData = {
      sender: currentUser.id,
      receiver: receiverId,
      message: newMessage,
    }

    try {
      const message = await chatService.sendMessage(messageData)
      setMessages([...messages, message])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <Container maxWidth="md">
      <Paper className="chat-container">
        <Typography variant="h4" gutterBottom>
          Chat with {receiverId}
        </Typography>
        <List className="chat-message-list">
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              className={msg.sender === currentUser.id ? 'sent' : 'received'}
            >
              <ListItemText
                primary={msg.message}
                secondary={
                  msg.timestamp && new Date(msg.timestamp).toLocaleString()
                }
              />
            </ListItem>
          ))}
        </List>
        <div className="chat-input-container">
          <TextField
            label="Type a message"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="chat-input"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </Paper>
    </Container>
  )
}

Chat.propTypes = {
  receiverId: PropTypes.string.isRequired,
}

export default Chat