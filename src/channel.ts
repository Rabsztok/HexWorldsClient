import socket from 'utils/socket'

interface Callbacks {
  onSuccess?(response: any): void
  onError?(response: any): void
}

export default class TileChannel {
  channelName: string
  connected: boolean
  socket: any

  constructor(channelName: string) {
    this.connected = false
    this.channelName = channelName
  }

  connect(payload: any, callbacks: Callbacks) {
    this.socket = socket.channel(this.channelName, payload)

    this.socket
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
