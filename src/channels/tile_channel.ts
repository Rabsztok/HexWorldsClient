import socket from 'utils/socket'
import World from 'records/world'

export default class TileChannel {
  channelName: string
  connected: boolean
  socket: any

  constructor(channelName: string) {
    this.connected = false
    this.channelName = channelName
  }

  connect(world: World, onConnectionSuccess: Function) {
    this.socket = socket.channel(this.channelName, { world_id: world.id })

    this.socket
      .join()
      .receive('ok', (response: any) => {
        this.connected = true
        onConnectionSuccess(response)
      })
      .receive('error', () => console.error('Connection error'))
  }
}
