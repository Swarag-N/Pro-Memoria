const fs = require('fs');
const dt = require('date-and-time');
// var express=require("express")
// var app=express();
// console.log(process.env.NODE_ENV.length)
// if (process.env.NODE_ENV == "development "){
//   let tk = require('timekeeper');
//   // March 19 Sat 4:45
//   console.log("In Testing")

//   let buf = new Date(2021,02,19,16,45)
//   let time = new Date(buf.getTime()); // January 1, 2030 00:00:00
//   tk.travel(time)
// }

const MILLISECS_PER_HOUR = 60 /* min/hour */ * 60 /* sec/min */ * 1000; /* ms/s */
const buff = new Date().getTime();

const current_time = new Date(buff - MILLISECS_PER_HOUR * 7);
// console.log(current_time.toString());

// let courses = fs.readFileSync("./output.json").toString();
// let slots = fs.readFileSync("./slot.json").toString();

// let courses_json = JSON.parse(courses);
// let slots_json = JSON.parse(slots);

function getSlotTime(slot) {
  const date = current_time.getDate();
  const month = current_time.getMonth();
  const year = current_time.getFullYear();

  const slot_hour = parseInt(slot.timing.substring(0, 2));
  const slot_minute = parseInt(slot.timing.substring(3, 5));

  return new Date(year, month, date, slot_hour, slot_minute);
}

function getCurrentCourses(courses_json, slots_json, timebuffer = 60) {
  const found_courses = [];

  const week_day = current_time.getDay();
  const date = current_time.getDate();
  const current_time_buffer = dt.addMinutes(current_time, timebuffer);

  // // seven_thirty_am
  // let upper_limit = new Date( current_time.getFullYear(), current_time.getMonth(), date, 7, 30 );
  // // eight_pm
  // let lower_limit = new Date( current_time.getFullYear(), current_time.getMonth(), date, 20, 0 );

  slots_json[week_day].forEach((slot) => {
    if (slot.timing) {
      slot_time = getSlotTime(slot);
      // console.log(slot_time.toTimeString() ,slot.timing)

      if (slot_time > current_time && slot_time < current_time_buffer) {
        console.log(slot);

        courses_json.forEach((course) => {
          // for loop through each slot of a course
          course.slot.forEach((slot_code) => {
            if (slot_code.toLowerCase() === slot.name) {
              found_courses.push(course);
            }
          });
        });
      }
    }
  });

  return found_courses;
}
// Minutes after any class??
const timebuffer = 60;
// console.log(getCurrentCourses(courses_json,slots_json,timebuffer));

// //starting server
// var port = process.env.PORT || 3001;

// app.listen(port, function (){
//   console.log("Server Has Started!")
// });

function formatMessage(foundSlots) {
  let msg = ' Hi \n';
  // console.log(foundSlots)
  foundSlots.forEach((foudSlot) => {
    msg += foudSlot.type;
    msg += '\n';
    msg += foudSlot.classRoom;
    msg += '\n\n\n';
  });
  return `${msg}Happy Hacking`;
}

function formatSubjectMessage(subject) {
  const { fname, name, classRoom } = subject;

  return `You have ${fname}'s \n ${name} class in ${classRoom}`;
}

function getAllCourseCodes(arr) {
  ccodes = {};
  for (let i = 0; i < arr.length; i++) {
    /*
      ccode:{'name':Course name,'types':[]}
      */
    const type = arr[i].type
      .split('(')
      [arr[i].type.split('(').length - 1].split(')')[0]
      .trim();
    const ccode = arr[i].CCode.trim();
    const cname = arr[i].type.split('(')[0].trim();
    if (ccodes[ccode]) {
      ccodes[ccode].types.push(type);
    } else {
      ccodes[ccode] = {
        name: cname,
        types: [type],
      };
    }
  }
  console.log(ccodes);
  return ccodes;
}

module.exports = {
  getCurrentCourses,
  formatMessage,
  getAllCourseCodes,
  formatSubjectMessage,
};
