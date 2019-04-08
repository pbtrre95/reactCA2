import React, {Component} from 'react';
import dateFns from 'date-fns';
import InfiniteCalendar from 'react-infinite-calendar';
import Button from 'react-bootstrap/Button';
import Login from '../Login';
import EmployeeList from './EmployeeList';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'react-infinite-calendar/styles.css'; // Make sure to import the default stylesheet

import { Link } from 'react-router-dom';
import axios from 'axios';

let loggedIn = false;

function changeDate(dateobj) {
  let fixedDate = dateobj.slice(0, 10);
  return fixedDate;
}

function ifLoggedIn(id) {
  if (loggedIn) {
    return <Link to={'/edit/' + id}><Button className="btn btn-primary">Update</Button></Link>;
  }
  else if (!loggedIn) {
    return '';
  }
}

const Event = props => (
  <tr>
    <td>{props.event._id}</td>
    <td>{changeDate(props.event.event_date)}</td>
    <td>{props.event.event_description}</td>
    <td>{ifLoggedIn(props.event._id)}</td>
    <td>
      <EmployeeList {...props} eventId={props.event._id} />
    </td>
  </tr>
);

let today = new Date();

export default class EventsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      today: today
    };

    loggedIn = this.props.loggedIn;

    // used to ensure setState will not be called on this component if it is unmounted
    this.state._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    axios.get('/api/events/')
      .then(response => {
        if (this._isMounted) {
          this.setState({events: response.data});
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidUpdate() {
    axios.get('/api/events/')
      .then(response => {
        if (this._isMounted) {
          this.setState({events: response.data});
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    // component is being unmounted, ensure setState cannot be run, i.e. when the async axios calls resolve
    this._isMounted = false;
  }

  eventList() {
    let day, mon, yr;
    let res = today.toString();
    let months = [
      ['Jan','01'],
      ['Feb','02'],
      ['Mar','03'],
      ['Apr','04'],
      ['May','05'],
      ['Jun','06'],
      ['Jul','07'],
      ['Aug','08'],
      ['Sep','09'],
      ['Oct','10'],
      ['Nov','11'],
      ['Dec','12']
    ];
    day = res.slice(8, 10);
    yr = res.slice(11, 15);
    for (let i = 0; i < months.length; i++) {
      if (res.substring(4, 7) === (months[i][0])) {
        mon = months[i][1];
      }
    }
    let checkDate = yr + '-' + mon + '-' + day;
    return this.state.events.map(function(currentEvent, i) {
      let eventDate = currentEvent.event_date.toString();
      let eventDateShortened = eventDate.slice(0,10);
      if (eventDateShortened === checkDate) {
        return <Event event={currentEvent} key={i} />;
      }
    });
  }

  checkLogin() {
    loggedIn = this.props.loggedIn;
  }

  render() {
    return (
      <div style={{ display:'flex'}}>
        <InfiniteCalendar
          onSelect={function(date) {
            today = date;
          }}
          width={1000}
          height={550}
          selected={this.state.today}
          onChange={this.checkLogin()}
        />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {this.eventList()}
          </tbody>
        </table>
      </div>
    );
  }
}
