import socket from 'utils/socket'

export default class WorldChannel {
  constructor(channelName) {
    this.channelName = channelName
  }

  connect (onConnectionSuccess) {
    this.socket = socket.channel(this.channelName, {})

    this.socket.join()
               .receive('ok', onConnectionSuccess)
               .receive('error', () => console.error('Connection error'))
  }
}