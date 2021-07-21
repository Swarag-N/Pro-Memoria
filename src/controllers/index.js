const fs = require('fs');
const path = require('path');

const axios = require('axios');
const User = require('../models/User');
const { createUser } = require('./user.controller');
const { addSubject } = require('./subjects.controller');
const {
  getTimeSlots,
  getSlotsfromTimeSlots,
  getSubjectiffound,
} = require('../helpers/backbone');
const { formatSubjectMessage } = require('../helpers/app');
const Subject = require('../models/Subject');

function welcome(ctx) {
  try {
    console.log(ctx.from);
    User.findOne({ tid: ctx.from.id }, (error, user) => {
      if (error) throw error;
      let msg = '';
      console.log(user);
      if (user) {
        msg = 'WelCome Back, please share your timetable for getting reminders';
      } else {
        createUser(ctx.from);
        msg = 'Hello there';
      }
      ctx.reply(msg);
    });
  } catch (error) {
    console.log(error);
    ctx.reply('There is servor issue, Try again Later');
  }
}

async function classInNextTMin(ctx) {
  // console.log(ctx.match)
  const buffer_time = ctx.match;
  console.log('USERNAME', ctx.from.username);
  // let path='./data/users/'+ctx.from.username+".json"
  try {
    let msg = 'You Have No Class in Time you gave';
    console.log(new Date());
    const upcomming_time_slost = await getTimeSlots(buffer_time);
    const upcomming_slots = await getSlotsfromTimeSlots(upcomming_time_slost);
    const found = await getSubjectiffound(upcomming_slots, ctx.from.id);
    if (found) {
      const subj = await Subject.findById(found)
        .exec()
        .then((subj) => subj)
        .catch((err) => {
          throw err;
        });
      msg = formatSubjectMessage(subj);
    }
    // let getSubjects
    ctx.deleteMessage();
    ctx.reply(msg);
    // ctx.reply(msg, {
    //     parse_mode: "MarkdownV2",
    //     // reply_markup: inlineCourseKeyboard
    //     reply_markup: {
    //         inline_keyboard: [
    //             [
    //                 {
    //                     text: "Back",
    //                     callback_data: "back",
    //                 },
    //                 // {
    //                 // 	text:'Confirm',
    //                 // 	callback_data:'confirm'
    //                 // }
    //             ],
    //         ],
    //     },
    // });
  } catch (err) {
    console.log(err);
    throw err;
  }
}
module.exports = { welcome, classInNextTMin };
