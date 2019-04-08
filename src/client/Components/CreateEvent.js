import React, {Component} from 'react';
import axios from 'axios';

export default class CreateEvent extends Component {

  constructor(props) {
    super(props);

    this.onChangeEventDate = this.onChangeEventDate.bind(this);
    this.onChangeEventDescription = this.onChangeEventDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      event_date: '',
      event_description: '',
    };
  }

  onChangeEventDescription(e) {
    this.setState({
      event_description: e.target.value
    });
  }

  onChangeEventDate(e) {
    this.setState({
      event_date: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const newEvent = {
      event_date: this.state.event_date,
      event_description: this.state.event_description
    };

    axios.post('/api/events', newEvent)
      .then(res => console.log(res.data));

    this.setState({
      event_date: '',
      event_description: ''
    });
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="row">
        <div className="col">
        </div>
        <div className="col-6" style={{marginTop: 50}}>
          <h1>Create Event</h1>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Date: </label>
              <input  type="date"
                className="form-control"
                value={this.state.event_date}
                onChange={this.onChangeEventDate}
              />
            </div>
            <div className="form-group">
              <label>Description: </label>
              <input  type="text"
                className="form-control"
                value={this.state.event_description}
                onChange={this.onChangeEventDescription}
              />
            </div>
            <div className="form-group">
              <input type="submit" value="Create Event" className="btn btn-primary" />
            </div>
          </form>
        </div>
        <div className="col">
        </div>
      </div>
    );
  }
}
