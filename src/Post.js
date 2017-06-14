import React, { Component } from 'react';
import { Jumbotron, Badge, Button, Input, ListGroup, ListGroupItem } from 'reactstrap';

const axios = require('axios');
// axios.defaults.baseURL = 'http://localhost:3001';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        id: null,
        user_id: null,
        username: '',
        title: '',
        content: '',
        time: null,
      },
      replies: [],
      reply: '',
    };

    this.typeReply = this.typeReply.bind(this);
    this.sendReply = this.sendReply.bind(this);
    this.reload = this.reload.bind(this);
  }

  componentDidMount() {
    this.reload();
  }

  reload() {
    axios.get(`/post/${this.props.match.params.postID}`)
    .then((res) => {
      this.setState({ post: res.data.post, replies: res.data.replies });
    });
  }

  typeReply(e) {
    this.setState({ reply: e.target.value });
  }

  sendReply() {
    if (this.state.reply !== '') {
      const timeStr = new Date().toLocaleString();
      const username = (this.props.username === '') ?
        'guest' : this.props.username;
      axios.post('/newreply', {
        postID: this.props.match.params.postID,
        username: username,
        content: this.state.reply,
        time: timeStr,
      }).then((res) => {
        if (res.data.replySuccess) {
          this.reload();
          this.setState({ reply: '' });
        }
      });
    }
  }

  render() {
    const Content = this.state.post.content.split('\n').map((seg) =>
      <span>
        {seg}
        <br />
      </span>);
    const Author = this.state.post.username;
    const Time = this.state.post.time;

    const Replies = this.state.replies.map((reply) =>
      <ListGroupItem key={reply.id}>
        <div className="ListTitle">
          { reply.content.split('\n').map((seg) =>
            <span> {seg} <br /> </span>) }
        </div>
        <Badge>{reply.username}</Badge>
        <Badge color="info">{reply.time}</Badge>
      </ListGroupItem>);

    const POST = (this.state.post.content !== '') ?
      <Jumbotron>
        <h2> {this.state.post.title} </h2>
        <p> {Content} </p>
        <Badge> {Author} </Badge>
        <Badge color="info"> {Time} </Badge>
        <hr />
        <ListGroup>
          {Replies}
        </ListGroup>
        <br />
        <h4> Reply </h4>
        <Input
          placeholder="Say something"
          type="textarea"
          style={{ height: '80px' }}
          onChange={this.typeReply}
          value={this.state.reply}
        />
        <Button
          color="primary"
          size="sm"
          style={{ float: 'right' }}
          onClick={this.sendReply}
        > Reply </Button>
      </Jumbotron> : null;

    return (
      <div className="Post">
        {POST}
      </div>
    );
  }
}

export default Post;
