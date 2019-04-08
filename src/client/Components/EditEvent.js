import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export default class EditEvent extends Component {

  constructor(props) {
    super(props);

    this.onChangeEventDate = this.onChangeEventDate.bind(this);
    this.onChangeEventDescription = this.onChangeEventDescription.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      event_date: '',
      event_description: ''
    };
  }

  componentDidMount() {
    axios.get('/api/events/' + this.props.match.params.id)
      .then(response => {
        this.setState({
          event_date: response.data.event_date,
          event_description: response.data.event_description
        });
      })

      .catch(function(error) {
        console.log(error);
      });
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
    const obj = {
      _id: this.props.match.params.id,
      event_date: this.state.event_date,
      event_description: this.state.event_description
    };
    axios.put('/api/events/', obj)
      .then(res => console.log(res.data));
    this.props.history.push('/');
  }

  deleteEvent(e) {
    e.preventDefault();

    axios.delete('/api/events/', {
      params: {
        _id: this.props.match.params.id,
      }
    })
      .then(res => console.log(res.data));
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="row">
        <div className="col">
        </div>
        <div className="col-6" style={{marginTop: 50}}>
          <h1>Update Event</h1>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Date: </label>
              <input type="date"
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
            <br/>
            <div className="form-group">
              <Button type="submit" className="btn btn-primary">Update</Button>
              <Button className="btn btn-danger" onClick={this.deleteEvent}>Delete</Button>
            </div>
          </form>
        </div>
        <div className="col">
        </div>
      </div>
    );
  }
}
