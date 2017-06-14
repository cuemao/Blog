import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Alert } from 'reactstrap';

const axios = require('axios');
// axios.defaults.baseURL = 'http://localhost:3001';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      incomplete: false,
      wrong: false,
      exist: false,
    };

    this.toggle = this.toggle.bind(this);
    this.clickLogin = this.clickLogin.bind(this);
    this.clickSignup = this.clickSignup.bind(this);
    this.typeUsername = this.typeUsername.bind(this);
    this.typePassword = this.typePassword.bind(this);
  }

  toggle() {
    this.props.onModalToggle();
    this.props.history.push('/');
  }

  clickLogin() {
    this.setState({
      incomplete: false,
      wrong: false,
      exist: false,
    });
    if (this.state.username === '' || this.state.password === '') {
      this.setState({ incomplete: true });
    } else {
      axios.post('/login', {
        username: this.state.username,
        password: this.state.password,
      }).then((res) => {
        if (res.data.checkLogin) {
          this.props.onSave(this.state.username, res.data.userID);
          this.toggle();
        } else this.setState({ wrong: true });
      });
    }
  }

  clickSignup() {
    this.setState({
      incomplete: false,
      wrong: false,
      exist: false,
    });
    if (this.state.username === '' || this.state.password === '') {
      this.setState({ incomplete: true });
    } else {
      axios.post('/signup', {
        username: this.state.username,
        password: this.state.password,
      }).then((res) => {
        if (res.data.checkSignup) {
          this.props.onSave(this.state.username, res.data.userID);
          this.toggle();
        } else this.setState({ exist: true });
      });
    }
  }

  typeUsername(e) {
    this.setState({ username: e.target.value });
  }

  typePassword(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <Modal isOpen toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>Login/Signup</ModalHeader>
        <ModalBody>
          <Input
            placeholder="username"
            value={this.state.username}
            onChange={this.typeUsername}
          />
          <Input
            placeholder="password"
            value={this.state.password}
            type="password"
            onChange={this.typePassword}
          />
          <br />
          {(this.state.incomplete) ?
            <Alert color="danger"> Please fill in all fields! </Alert> : null }
          {(this.state.wrong) ?
            <Alert color="danger"> Wrong username or password! </Alert> : null}
          {(this.state.exist) ?
            <Alert color="danger"> Username exists! </Alert> : null}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.clickLogin}>Login</Button>
          <Button color="primary" onClick={this.clickSignup}>Signup</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default Login;
