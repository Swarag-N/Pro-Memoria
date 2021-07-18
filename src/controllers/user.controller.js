const User = require('../models/User');

function createUser(ctxFrom) {
  const { username: name, id: tid } = ctxFrom;
  User.create({ name, tid }, (error, newUser) => {
    if (error) throw error;
  });
}

module.exports = { createUser };
