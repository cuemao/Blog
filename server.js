const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12179867',
    password: 'blw7lreM7j',
    database: 'sql12179867',
  },
});

const app = express();

app.set('port', 3001);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  next();
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  knex.select().from('Users').where({ username: username })
  .then((result) => {
    if (result.length === 0) res.json({ checkLogin: false });
    else {
      res.json({
        checkLogin: bcrypt.compareSync(password, result[0].password),
        userID: result[0].id,
      });
    }
  });
});

app.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  knex.select().from('Users').where({ username: username })
  .then((result) => {
    if (result.length > 0) res.json({ checkSignup: false });
    else {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      knex('Users').insert({
        username: username,
        password: hash,
      }).then((result2) => {
        res.json({
          checkSignup: true,
          userID: result2[0],
        });
      });
    }
  });
});

app.post('/newpost', (req, res) => {
  const username = req.body.username;
  const userID = req.body.userID;
  const title = req.body.title;
  const content = req.body.content;
  const time = req.body.time;
  knex('Posts').insert({
    username: username,
    user_id: userID,
    title: title,
    content: content,
    time: time,
  }).then(() => {
    res.json({ postSuccess: true });
  });
});

app.get('/postlist', (req, res) => {
  knex.select().from('Posts').orderBy('id', 'desc')
  .then((result) => {
    res.json({ posts: result });
  });
});

app.get('/post/:id', (req, res) => {
  const postID = parseInt(req.params.id);
  knex.select().from('Posts').where({ id: postID })
  .then((result) => {
    knex.select().from('Replies').where({ post_id: postID })
    .then((result2) => {
      res.json({ post: result[0], replies: result2 });
    });
  });
});

app.post('/newreply', (req, res) => {
  const postID = req.body.postID;
  const username = req.body.username;
  const content = req.body.content;
  const time = req.body.time;
  knex('Replies').insert({
    post_id: postID,
    username: username,
    content: content,
    time: time,
  }).then(() => {
    res.json({ replySuccess: true });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(app.get('port'), () => {
  console.log('listening on port ', app.get('port'), '!');
});
