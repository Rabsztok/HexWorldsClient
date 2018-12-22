import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import {
  Fab,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { map } from 'lodash'

class WorldDialog extends Component {
  @observable open = false
  @observable name

  submit = e => {
    e.preventDefault()

    const pushEvent = this.props.store.worldStore.create(this.name)
    pushEvent.receive('error', this.onError)
    pushEvent.receive('success', this.onSuccess)
  }

  onError = errors => {
    map(errors, (message, attribute) => {
      alert(`${attribute} ${message}`)
    })
  }

  onSuccess = () => {
    this.name = null
    this.closeDialog()
  }

  openDialog = () => {
    this.open = true
  }

  closeDialog = () => {
    this.open = false
  }

  setName = e => {
    this.name = e.target.value
  }

  render() {
    return (
      <div>
        <Fab color="primary" onClick={this.openDialog}>
          <AddIcon />
        </Fab>

        <Dialog
          open={this.open}
          onClose={this.closeDialog}
          fullWidth
          maxWidth="xs"
        >
          <form onSubmit={this.submit}>
            <DialogTitle id="form-dialog-title">Create World</DialogTitle>
            <DialogContent>
              <TextField
                id="name"
                label="World name"
                fullWidth
                autoFocus
                margin="dense"
                defaultValue={this.name}
                onChange={this.setName}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog} color="primary">
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
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
