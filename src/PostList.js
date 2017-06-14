import React, { Component } from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, Badge } from 'reactstrap';

const axios = require('axios');
// axios.defaults.baseURL = 'http://localhost:3001';

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
    this.clickItem = this.clickItem.bind(this);
  }

  componentDidMount() {
    axios.get('/postlist')
    .then((res) => {
      this.setState({ posts: res.data.posts });
    });
  }

  clickItem(i) {
    this.props.history.push(`/postPage/${i}`);
  }

  render() {
    const Posts = this.state.posts.map((post) =>
      <ListGroupItem
        action
        key={post.id}
        onClick={() => this.clickItem(post.id)}
      >
        <ListGroupItemHeading className="ListTitle">
          {post.title}
        </ListGroupItemHeading>
        <div>
          <Badge>{post.username}</Badge>
          <Badge color="info">{post.time}</Badge>
        </div>
      </ListGroupItem>);
    return (
      <div className="listgroup">
        <ListGroup>
          {Posts}
        </ListGroup>
      </div>
    );
  }
}

export default PostList;
