const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    fname: {
        type: String,
        required: true
    },
    venue:{
        type: String,
        required: true
    }

});

const Subject = new mongoose.model('Subject',subjectSchema );
module.exports = Subject;