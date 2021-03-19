const fs = require("fs");
const { Telegraf } = require('telegraf')
const {getCurrentCourses,formatMessage} = require('./helper');
const result = require('dotenv').config()

if (process.env.NODE_ENV){
  const result = require('dotenv').config()
  
  if (result.error) {
    throw result.error
  }
}



const BOT_API = process.env.TELEGRAM_BOT
const courses = process.env.COURSES
const CHAT_ID = process.env.CHAT_ID


let slots = fs.readFileSync("./src/slot.json").toString();
let courses_json = JSON.parse(courses);
let slots_json = JSON.parse(slots);

let to_notify_courses = getCurrentCourses(courses_json,slots_json,50)
let msg = formatMessage(to_notify_courses)

const bot = new Telegraf(BOT_API)

bot.telegram.sendMessage(CHAT_ID,msg).then(()=>{
    process.emit("SIGINT")
}).catch((error=>{
    console.warn(error)
}))

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
