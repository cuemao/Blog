import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap';
import Login from './Login';
import PostList from './PostList';
import NewPost from './NewPost';
import Post from './Post';

const NotFound = () => (
  <h1> 404 Not Found </h1>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      userID: null,
      loginModal: false,
      incomplete: false,
    };
    this.clickLogin = this.clickLogin.bind(this);
    this.clickLogout = this.clickLogout.bind(this);
    this.clickNewpost = this.clickNewpost.bind(this);
    this.saveUserInfo = this.saveUserInfo.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
  }

  clickLogin() {
    this.setState({ loginModal: true });
  }

  clickLogout() {
    this.setState({ username: '', userID: null });
  }

  clickNewpost() {
    this.setState({ newPostModal: true });
  }

  saveUserInfo(username, userID) {
    this.setState({ username: username, userID: userID });
  }

  modalToggle() {
    this.setState({
      loginModal: false,
      newPostModal: false,
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar color="faded" fixed="top" style={{ maxHeight: '60px' }}>
            <Nav>
              <NavItem>
                <NavLink tag={Link} to="/">Home</NavLink>
              </NavItem>
              <NavItem>
                {(this.state.username === '') ?
                  <NavLink
                    tag={Link}
                    to="/loginPage"
                    onClick={this.clickLogin}
                  >Login/Signup</NavLink> :
                  <NavLink
                    tag={Link}
                    to="/"
                    onClick={this.clickLogout}
                  >Logout</NavLink>}
              </NavItem>
              <NavItem>
                {(this.state.username !== '') ?
                  <NavLink
                    tag={Link}
                    to="/newpostPage"
                    onClick={this.clickNewpost}
                  >New Post</NavLink> : null}
              </NavItem>
              <NavItem>
                {(this.state.username !== '') ?
                  <NavLink>Hi, {this.state.username}!</NavLink> :
                  <NavLink>Login to add new post!</NavLink>}
              </NavItem>
            </Nav>
          </Navbar>
          <div className="Blank" />
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <PostList
                  {...props}
                  username={this.state.username}
                  userID={this.state.userID}
                />)}
            />
            <Route
              path="/loginPage"
              render={(props) => (
                (this.state.loginModal) ?
                  <Login
                    {...props}
                    onSave={this.saveUserInfo}
                    onModalToggle={this.modalToggle}
                  /> : null)}
            />
            <Route
              path="/newpostPage"
              render={(props) => (
                (this.state.newPostModal) ?
                  <NewPost
                    {...props}
                    username={this.state.username}
                    userID={this.state.userID}
                    onModalToggle={this.modalToggle}
                  /> : null)}
            />
            <Route
              path="/postPage/:postID"
              render={(props) => (
                <Post
                  {...props}
                  username={this.state.username}
                />)}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
