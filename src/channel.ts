const { Socket } = require('phoenix-socket')
const apiUrl = process.env.REACT_APP_WEBSOCKET_URL

let socket: any
if (typeof window !== 'undefined') {
  socket = new Socket(apiUrl)
  socket.connect()
}

interface Callbacks {
  onSuccess?(response: any): void
  onError?(response: any): void
}

export default class Channel {
  channelName: string
  connected: boolean
  connection: any
  socket = socket

  constructor(channelName: string) {
    this.connected = false
    this.channelName = channelName
  }

  connect(payload: any, callbacks: Callbacks) {
    this.connection = this.socket.channel(this.channelName, payload)

    this.connection
      .join()
      .receive('ok', (response: any) => {
        this.connected = true
        callbacks.onSuccess && callbacks.onSuccess(response)
      })
      .receive('error', (response: any) => {
        console.error('Connection error')
        callbacks.onError && callbacks.onError(response)
      })
  }
}
