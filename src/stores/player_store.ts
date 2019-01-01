import { observable, computed } from 'mobx'
import Player from 'models/player'
import Channel from 'channel'
import Tile from 'models/tile'
import { IWorld } from 'models/world'
import { randomInt } from 'utils/random'

class PlayerStore {
  readonly players = observable.map<string, Player>()
  world: IWorld
  channel: Channel
  @observable currentPlayerId?: string

  constructor(world: IWorld) {
    this.world = world
    this.channel = new Channel('players:lobby')
  }

  connect(): void {
    if (this.channel.connected) return

    this.channel.connect(
      { world_id: this.world.id },
      { onSuccess: this.onPlayersLoaded }
    )

    this.channel.connection.on('move', this.onPlayerMove)
    this.channel.connection.on('create', this.onPlayerCreate)
  }

  onPlayersLoaded = (response: { players: Player[] }): void => {
    response.players.forEach(player => this.players.set(player.id, player))
  }

  onPlayerMove = ({ player }: { player: Player }): void => {
    const localPlayer = this.players.get(player.id)

    if (localPlayer) localPlayer.tile_id = player.tile_id
  }

  onPlayerCreate = ({ player }: { player: Player }): void => {
    this.players.set(player.id, player)
    this.currentPlayerId = player.id
  }

  create = (tile: Tile): void => {
    this.channel.connection.push('create', {
      name: `User no. ${randomInt(1, 1000)}`,
      world_id: this.world.id,
      tile_id: tile.id
    })
  }

  move = (player: Player, tile: Tile): void => {
    this.channel.connection.push('move', {
      player_id: player.id,
      tile_id: tile.id
    })
  }

  @computed
  get currentPlayer() {
    if (!this.currentPlayerId) return undefined
    return this.players.get(this.currentPlayerId)
  }

  @computed
  get playersList() {
    return Array.from(this.players.values())
  }

  @computed
  get playersToRender() {
    return this.playersList.filter(player => !player.rendered)
  }
}

export default PlayerStore
