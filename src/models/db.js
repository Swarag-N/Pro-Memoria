const mongoose = require('mongoose');


const DB_OPTIONS = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
};

// mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("Hi")

// });

function connectToDB() {
    mongoose.connect(process.env.DATABASE, {...DB_OPTIONS})
    /* istanbul ignore next */
        .catch((err)=>{
          throw err;
        });
}
  
  
module.exports = {connectToDB};
