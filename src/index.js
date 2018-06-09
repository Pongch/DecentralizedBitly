import React from 'react'
import ReactDOM from 'react-dom'
import main from './main'
import redirect from './redirect'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={main} />
      <Route path="/:id" component={redirect}/> 
    </div>
  </Router>,
  document.getElementById('root')
);
