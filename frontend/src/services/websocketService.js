let socket

const connect = (userId) => {
  socket = new WebSocket(`ws://localhost:5000?userId=${userId}`)

  socket.onopen = () => {
    console.log('WebSocket connection established')
  }

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data)
    // Handle the received data here, e.g., update state or notify components
  }

  socket.onclose = () => {
    console.log('WebSocket connection closed')
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

const disconnect = () => {
  if (socket) {
    socket.close()
  }
}

const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  }
}

const websocketService = { connect, disconnect, sendMessage }
export default websocketService
