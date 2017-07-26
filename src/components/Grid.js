import React, {Component} from 'react'
import {observer} from 'mobx-react'
import playerStore from 'stores/playerStore'
import gridStore from 'stores/gridStore'
import _bindAll from 'lodash/bindAll'

@observer
class Grid extends Component {
  constructor(props, context) {
    super(props, context)

    _bindAll(this, 'handleKeyPress')
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress)
    gridStore.draw()
  }

  handleKeyPress(e) {
    if (e.code === 'Space') {
    }
  }

  render() {
    return (
        <group ref={(grid) => gridStore.setGrid(grid)}/>
    )
  }
}

export default Grid