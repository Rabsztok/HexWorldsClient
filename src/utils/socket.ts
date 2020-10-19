import { Socket } from 'phoenix-socket'

const apiUrl = process.env.REACT_APP_WEBSOCKET_URL
let socket

if (typeof window !== 'undefined') {
  socket = new Socket(apiUrl)
  socket.connect()
}

export default socket
