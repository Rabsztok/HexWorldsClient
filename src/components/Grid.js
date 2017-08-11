import React, {Component} from 'react'
import {observer} from 'mobx-react'
import gridStore from 'stores/gridStore'

@observer
class Grid extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress)
  }

  render() {
    return (
        <group ref={(grid) => gridStore.setGrid(grid)}/>
    )
  }
}

export default Grid