const fs = require("fs");
const dt = require("date-and-time");

let MILLISECS_PER_HOUR = 60 /* min/hour */ * 60 /* sec/min */ * 1000 /* ms/s */;
let buff = new Date().getTime()


let current_time = new Date(buff - MILLISECS_PER_HOUR*7);
console.log(current_time.toString());

let courses = fs.readFileSync("./output.json").toString();
let slots = fs.readFileSync("./slot.json").toString();

let courses_json = JSON.parse(courses);
let slots_json = JSON.parse(slots);

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

    // // seven_thirty_am
    // let upper_limit = new Date( current_time.getFullYear(), current_time.getMonth(), date, 7, 30 );
    // // eight_pm
    // let lower_limit = new Date( current_time.getFullYear(), current_time.getMonth(), date, 20, 0 );

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
// Minutes after any class??
let timebuffer = 60 
console.log(getCurrentCourses(courses_json,slots_json,timebuffer));
