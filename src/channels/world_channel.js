import socket from 'utils/socket'

export default class WorldChannel {
  constructor({ onSuccess, onError }) {
    onSuccess = onSuccess || (() => {})
    onError = onError || (() => console.error('Connection error'))

    this.topic = 'worlds:lobby'
    this.socket = socket.channel(this.topic, {})

    this.socket
      .join()
      .receive('ok', onSuccess)
      .receive('error', onError)
  }
}
