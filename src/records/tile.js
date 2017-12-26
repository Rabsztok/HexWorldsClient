class Tile {
  constructor(tile) {
    Object.assign(this, tile)
  }

  get renderHeight() {
    return this.terrain.type === "water" ? 1 : this.height
  }
}

export default Tile