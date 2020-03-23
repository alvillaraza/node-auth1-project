const express = require('express');
const helmet = require('helmet');
const cors = requier('cors');
const sessions = require('express-session');

const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: "auth lesson",
  secret: "keept it secret",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, //true in production
    httpOnly: true,

  },
  resave: false,
  saveUninitialized: true,
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/users', restricted, usersRouter);


server.get('/', (req, res) => {
  res.json({ api: 'running' })
});

module.exports = server;