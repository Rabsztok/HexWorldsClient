import socket from 'utils/socket'

export default class TileChannel {
  constructor(channelName) {
    this.channelName = channelName
  }

  connect (world, onConnectionSuccess) {
    this.socket = socket.channel(this.channelName, { world_id: world.id })
    console.log('TileChannel connect')

    this.socket.join()
               .receive('ok', onConnectionSuccess)
               .receive('error', () => console.error('Connection error'))
  }
}