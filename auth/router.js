const bcrypt = require('bcryptjs');
const router = require('express').Router();
const Users = require('../users/users-model.js');

//let user register
router.post('/register', (req, res) => {
  const userInfo = req.body;
  
  const ROUNDS = process.env.HASHING_ROUNDS || 8;
  const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

  userInfo.password = hash;

  Users.add(userInfo)
    .then(user => {
      res.json(user);
    })
    .catch(err => res.send(err));
});

//let user login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username, password })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = {
          id: user.id,
          username: user.username,
        }
        
        res.status(200).json({ hello: user.username });
      } else {
        res.status(401).json({ message: 'invalid credentials' });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'error finding the user' });
    });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (error) {
        res.status(500).json({ message: 'unable to logout' })
      } else {
        res.status(200).json({ message: 'logged out successfully' });
      }
    });
  } else {
    res.status(200).json({ message: 'not a valid user' })
  }
});

module.exports = router;