const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    tid: {
        type: String,
        required: true,
        // unique: true
    },
});

const User = new mongoose.model('User',userSchema );
module.exports = User;