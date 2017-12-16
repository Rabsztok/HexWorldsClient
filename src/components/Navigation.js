import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import routes from 'utils/routes'

export default class Navigation extends Component {
  render() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Link to={routes.root()}>
            <Typography type="title">
              Hex Worlds
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    )
  }
}

