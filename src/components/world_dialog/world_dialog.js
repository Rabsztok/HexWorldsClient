import React, {Component} from 'react'
import {observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import autobind from 'autobind-decorator'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import {map} from 'lodash'

class WorldDialog extends Component {
  @observable open = false
  @observable name
  @observable size

  @autobind
  submit(e) {
    e.preventDefault()

    const pushEvent = this.props.store.worldStore.create(this.name, this.size)
    pushEvent.receive("error", this.onError)
    pushEvent.receive("success", this.onSuccess)
  }

  @autobind
  onError(errors) {
    map(errors, (message, attribute) => {
      alert(`${attribute} ${message}`)
    })
  }

  @autobind
  onSuccess() {
    this.name = null
    this.size = null
    this.closeDialog()
  }

  @autobind
  openDialog() {
    this.open = true
  }

  @autobind
  closeDialog() {
    this.open = false
  }

  @autobind
  setName(e) {
    this.name = e.target.value
  }

  @autobind
  setSize(e) {
    this.size = e.target.value
  }

  render() {
    return (
        <div>
          <Button fab color="primary" onClick={this.openDialog}>
            <AddIcon/>
          </Button>

            <Dialog open={this.open} onClose={this.closeDialog}>
              <DialogTitle id="form-dialog-title">Create World</DialogTitle>
              <form onSubmit={this.submit}>
                <DialogContent>
                  <TextField
                      autoFocus
                      id="name"
                      label="World name"
                      defaultValue={this.name}
                      onChange={this.setName}
                  />
                  <TextField
                      id="size"
                      label="Initial radius"
                      type="number"
                      defaultValue={this.size}
                      onChange={this.setSize}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.closeDialog} color="primary">
                    Cancel
                  </Button>
                  <Button raised color="primary" type="submit">
                    Create
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
        </div>
    )
  }
}

export default inject('store')(observer(WorldDialog))