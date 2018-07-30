const User = require('../models/user.model.js');
const common = require('../common/functions');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        res.status(409).json({ message: 'Email already exist.' });
      } else {
        // Create User
        const user = new User({
          slug: common.generateSlug(),
          email: email,
          password: bcrypt.hashSync(password),
        });

        user.save()
          .then(data => {
              res.send(data);
          }).catch(err => {
              res.status(500).send({
                  message: err.message || "Some error occurred while signup proccess."
              });
          });
      }
    }).catch(err => {
      console.log(err);
    });
};

exports.login = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  // find the user
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        res.json({ success: false, message: 'Authentication failed user not found.' });
      } else {
        // check if password matches
        if (bcrypt.compareSync(password, user.password)) {
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: createToken(user, process.env.JWT_SECRET)
          });
        } else {
          res.json({
            success: false,
            message: 'Authentication failed.'
          });
        }
      }
    }).catch(err => {
      // TODO log error
      return res.status(500).send({
          message: "Login failed: " + err.message
      });
    });

};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};


function createToken(user, superSecretKey) {
  const payload = {
    role: 'user', // TODO use enum
    email: user.email,
  };

  var token = jwt.sign(payload, superSecretKey, {
    expiresIn: 7200 // expires in 2 hours
  });

  return token;
}
