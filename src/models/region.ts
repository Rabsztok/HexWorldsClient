class Region {
  x: number
  y: number
  z: number
  state: string

  constructor(region: Region) {
    this.x = region.x
    this.y = region.y
    this.z = region.z
    this.state = region.state
  }
}

export default Region
