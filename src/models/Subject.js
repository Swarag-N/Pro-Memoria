const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    // TODO ADD SLOTS HERE ALSO
    type:String,
    CCode:String,
    name: {
      type: String,
      required: true,
    },
    LTPJC:String,
    category:String,
    classRoom:{
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
});

const Subject = new mongoose.model('Subject',subjectSchema );
module.exports = Subject;