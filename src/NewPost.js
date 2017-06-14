import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Alert } from 'reactstrap';

const axios = require('axios');
// axios.defaults.baseURL = 'http://localhost:3001';

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      incomplete: false,
    };

    this.toggle = this.toggle.bind(this);
    this.clickPost = this.clickPost.bind(this);
    this.typeTitle = this.typeTitle.bind(this);
    this.typeContent = this.typeContent.bind(this);
  }

  toggle() {
    this.props.onModalToggle();
    this.props.history.push('/');
  }

  clickPost() {
    this.setState({
      incomplete: false,
    });
    if (this.state.title === '' || this.state.content === '') {
      this.setState({ incomplete: true });
    } else {
      const timeStr = new Date().toLocaleString();
      axios.post('/newpost', {
        username: this.props.username,
        userID: this.props.userID,
        title: this.state.title,
        content: this.state.content,
        time: timeStr,
      }).then((res) => {
        if (res.data.postSuccess) {
          this.toggle();
        }
      });
    }
  }

  typeTitle(e) {
    this.setState({ title: e.target.value });
  }

  typeContent(e) {
    this.setState({ content: e.target.value });
  }

  render() {
    return (
      <Modal isOpen toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>New Post</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Title"
            onChange={this.typeTitle}
          />
          <Input
            placeholder="Say something"
            type="textarea"
            style={{ height: '200px' }}
            onChange={this.typeContent}
          />
          <br />
          {(this.state.incomplete) ?
            <Alert color="danger"> Please fill in all fields! </Alert> : null }
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.clickPost}>Post</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default NewPost;
