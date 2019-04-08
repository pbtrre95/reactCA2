import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

class EmployeeList extends Component {
  constructor(props) {
    super(props);
    this.state = { employees: [] };
  }

  componentDidMount() {
    axios.get('/api/events/' + this.props.eventId + '/employees', {
    })
      .then(response => {
        this.setState({ employees: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const employeeList = this.state.employees.map(u => (
      <Employee
        key={u._id}
        id={u._id}
        name={u.name}
        type={u.type}
        event_id={u.event_id}
      />
    ));

    return (
      <div>
        {employeeList.length ?
          <table>
            <tr>
              <td><p>All Employees</p></td>
              <td><div>{employeeList}</div></td>
            </tr>
          </table> :
          <p>No Employees</p>
        }
      </div>
    );
  }
}

const Employee = (props) => {
  return (
    <div>
      <p>{props.name}</p>
      <p>Type: {props.type}</p>
    </div>
  );
};

export default EmployeeList;
