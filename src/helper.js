const fs = require("fs");
var tk = require('timekeeper');
const dt = require("date-and-time");

if (process.env.NODE_ENV == "test "){
  let tk = require('timekeeper');
  // March 19 Sat 4:45
  console.log("In Testing")
  
  let buf = new Date(2021,02,19,16,45)
  let time = new Date(buf.getTime()); // January 1, 2030 00:00:00
  tk.travel(time)
}


let current_time = new Date()

if (process.env.NODE_ENV == "development "){
  console.log("IN Development")
  let MILLISECS_PER_HOUR = 60 /* min/hour */ * 60 /* sec/min */ * 1000 /* ms/s */;
  
  let buff = new Date().getTime()
  current_time = new Date(buff - MILLISECS_PER_HOUR*10);
}

console.log(current_time.toString());


function getSlotTime(slot) {
    let date = current_time.getDate();
    let month = current_time.getMonth();
    let year = current_time.getFullYear();

    let slot_hour = parseInt(slot.timing.substring(0, 2));
    let slot_minute = parseInt(slot.timing.substring(3, 5));
    
    return new Date(year, month, date, slot_hour, slot_minute);
}


function getCurrentCourses(courses_json, slots_json, timebuffer) {
    let found_courses = [];

    let week_day = current_time.getDay();
    let date = current_time.getDate();
    let current_time_buffer = dt.addMinutes(current_time, timebuffer);

    // seven_thirty_am
    let upper_limit = new Date( current_time.getFullYear(), current_time.getMonth(), date, 7, 30 );
    // eight_pm
    let lower_limit = new Date( current_time.getFullYear(), current_time.getMonth(), date, 20, 0 );

    slots_json[week_day].forEach((slot) => {

        if (slot.timing) {
            slot_time = getSlotTime(slot)
            // console.log(slot_time.toTimeString() ,slot.timing)
            
            if ( (slot_time > current_time) && (slot_time <current_time_buffer)){
              console.log(slot)

              courses_json.forEach((course) => {
                // for loop through each slot of a course
                course.slot.forEach((slot_code) => {
                    if(slot_code.toLowerCase() === slot.name) {
                        found_courses.push(course);
                    }
                });
            });

          }
      }
    });

  return found_courses;
}


// {
//   "slot": ["D1", "TD1"],
//   "type": " JAVA Programming and Software Engineering Fundamentals  ( Soft Skill )",
//   "CCode": "STS3204 ",
//   "CName": "",
//   "LTPJC": ["0", "0", "0", "0", "1"],
//   "category": "University Core (GENERAL Basket)",
//   "classRoom": "ETHNUS (APT) -  SSL",
//   "fName": "19-Dec-2020 14:01"
// }
function formatMessage(foundSlots){
  let msg = " Hi \n"
  // console.log(foundSlots)
  foundSlots.forEach((foudSlot) => {
    msg+=foudSlot.type
    msg+="\n"
    msg+=foudSlot.classRoom
    msg+="\n\n\n"
  });
  return msg+"Happy Hacking"
}

module.exports = {getCurrentCourses,formatMessage}