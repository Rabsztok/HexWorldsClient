import React, {Component} from 'react'
import {observer} from 'mobx-react'
import TileSelection from 'components/interface/TileSelection'

@observer
class Interface extends Component {
  render() {
    return (
        <group>
          <TileSelection/>
        </group>
    )
  }
}

export default Interface