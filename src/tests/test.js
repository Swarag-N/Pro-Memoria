const db = require("../models/db");
const Slot = require("../models/Slot");
const User = require("../models/User");
const Subject = require("../models/Subject");
const faker = require("faker");
const result = require("dotenv").config();

if (process.env.NODE_ENV) {
    const result = require("dotenv").config();
    console.log("Hii");
    if (result.error) {
        throw result.error;
    }
}

function getRandomElemetofArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// db.connectToDB();

// aysnc (){
//     let users = await User.find({})
//   .exec()
//   .then((users) => users)
//   .catch((err) => {
//     throw err;
//   });

// let subjects = Subject.find({})
//   .exec()
//   .then((subjects) => subjects)
//   .catch((err) => {
//     throw err;
//   });

// // try {
//   let slots = await Slot.find({})
//     .exec()
//     .then((slots) => {
//       return slots;
//     })
//     .catch((err) => {
//       throw err;
//     });

//   console.log(slots);
// // } catch (error) {}

// // slots.forEach(slot => {
// //     for(let i=0;i<10;i++){
// //         let u = getRandomElemetofArray(users)
// //         let subj = getRandomElemetofArray(subjects)
// //         slot.reg_users.set(u._id,subj._id)
// //     }
// //     slot.save()
// // });
// }()

(async () => {
    db.connectToDB();

    let users = await User.find({})
        .exec()
        .then((users) => users)
        .catch((err) => {
            throw err;
        });

    let subjects = await Subject.find({})
        .exec()
        .then((subjects) => subjects)
        .catch((err) => {
            throw err;
        });

    let slots = await Slot.find({})
        .exec()
        .then((slots) => {
            return slots;
        })
        .catch((err) => {
            throw err;
        });

    slots.forEach((slot) => {
        for (let i = 0; i < 10; i++) {
            let u = getRandomElemetofArray(users);
            let subj = getRandomElemetofArray(subjects);
            slot.set(`reg_users.${u.tid}`, subj._id);
        }
        slot.save();
    });
})();
