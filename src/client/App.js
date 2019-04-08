import React, { Component } from 'react';
import { BrowserRouter as Router, HashRouter, Link, Route, Switch } from 'react-router-dom';
import withAuth from './withAuth';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import CreateEvent from './Components/CreateEvent';
import EditEvent from './Components/EditEvent';
import EventsList from './Components/EventsList';
import EmployeeList from './Components/EmployeeList';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {loggedIn: false};
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }

  logout(props) {
    axios.get('api/logout')
      .then(res => {
        this.setState({loggedIn: false});
        props.history.push('/');
      })
      .catch( err => console.log(err));
    return null;
  }

  login() {
    this.setState({loggedIn: true});
  }

  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <div className="navbar-header">
                <ul className="nav navbar-nav">
                  <li className="active"><Link to="/" className="navbar-brand">Home</Link></li>
                </ul>
              </div>

              <div id="navbar" className="collapse navbar-collapse">
        				<ul className="nav navbar-nav navbar-right">
                  <li className="navbar-brand"><Link to="/create" className="nav-link">Create Event</Link></li>
                  {!this.state.loggedIn && <li className="navbar-brand"><Link to="/login" className="nav-link">Login</Link></li>}
                  {!this.state.loggedIn && <li className="navbar-brand"><Link to="/register" className="nav-link">Register</Link></li>}
                  {this.state.loggedIn && <li className="navbar-brand"><Link to="/logout" className="nav-link">Logout</Link></li>}
                </ul>
              </div>
            </div>
          </nav>

          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" render={(props) => <Login {...props} handleLogin={this.login} />} />
            <Route path="/logout" render={this.logout}/>
          </Switch>


          <Route path="/" exact render={(props) => <EventsList {...props} loggedIn={this.state.loggedIn} />} />
          <Route path="/employee/:id" component={EmployeeList}/>
          <Route path="/edit/:id" component={EditEvent} />
          <Route path="/create" component={CreateEvent} />
        </div>
      </Router>
    );
  }
}

export default App;
