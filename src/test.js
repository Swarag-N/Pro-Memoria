const fs = require("fs");
const {getCurrentCourses,formatMessage} = require('./helper');
const result = require('dotenv').config()


const courses = process.env.COURSES


let slots = fs.readFileSync("./src/slot.json").toString();
let courses_json = JSON.parse(courses);
let slots_json = JSON.parse(slots);

let to_notify_courses = getCurrentCourses(courses_json,slots_json,15)
console.log(formatMessage(to_notify_courses))
console.log(process.env.NODE_ENV)
