const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/router.js');
const restricted = require('../auth/restricted-middleware.js');

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
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
  res.json({ api: 'running' })
});

module.exports = server;