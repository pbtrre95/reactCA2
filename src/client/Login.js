import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email : '',
      password: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/api/authenticate', this.state)
      .then(res => {
        if (res.status === 200) {
          // run the login function in the parent component
          this.props.handleLogin();
          // redirect to /
          this.props.history.push('/');
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error logging in please try again');
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col">
        </div>
        <div className="col-6" style={{marginTop: 50}}>
          <h1>Login Below!</h1>
          <Form onSubmit={e => this.handleSubmit(e)}>
            <Form.Group controlid="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control controlid="formGridEmail" type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleInputChange} required />
            </Form.Group>

            <Form.Group controlid="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control controlid="formGridPassword" type="password" name="password" value={this.state.password} onChange={this.handleInputChange} required placeholder="Password" />
            </Form.Group>
            <Button type="submit" value="Submit">Login</Button>
          </Form>
        </div>
        <div className="col">
        </div>
      </div>
    );
  }
}
