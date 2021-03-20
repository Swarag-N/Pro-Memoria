const fs = require("fs");
const { Telegraf } = require('telegraf')
const needle = require('needle');
const axios = require('axios');
const { json } = require("body-parser");
const {getCurrentCourses} = require('./helpers/app');
const pat=require('path')
if (process.env.NODE_ENV){
  const result = require('dotenv').config()
  
  if (result.error) {
    throw result.error
  }
}

const BOT_API = process.env.TELEGRAM_BOT
const courses = process.env.COURSES
const CHAT_ID = process.env.CHAT_ID


const bot = new Telegraf(BOT_API)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => {
    console.group(ctx.from)
    ctx.reply('Hey there')
})

bot.on('document',async (ctx)=>{
    
    try {
        let fileData= (ctx.update.message.document)
        
        if (fileData.mime_type !== 'application/json'){
            throw Error("Please Send a Valid File")
        }

        console.group(ctx.from)
        const fileUrl = await ctx.telegram.getFileLink(fileData.file_id)
        console.log(fileUrl)
        // axios.get(`https://api.telegram.org/bot${BOT_API}/getFile?file_id=${fileData.file_id}`,function(error, response) {
        //     if (!error && response.statusCode == 200){
        //         data = JSON.parse(response.raw)
        //         console.log(data)
        //     }else{
        //         throw Error("Please Try Again")
        //     }
        // });
        const response = await axios.get(fileUrl.href);
        // const response=await axios.get(`https://api.telegram.org/bot${BOT_API}/getFile?file_id=${fileData.file_id}`)
        console.log(response)
        if(response.status===200 || statusText==="OK"){
            // let path='./data/users/'+ctx.from.username+".json"
            var data=JSON.stringify(response.data);
            fs.writeFileSync(pat.join(__dirname,"data/users",ctx.from.username+".json"),data)
            
        }
        
        // fs.writeFileSync("./data/users/")
        // console.log(data)
        ctx.reply("Thank You File upload Done")
    } catch (error) {
        console.log(error)
        ctx.reply(error)
        
    }
})

bot.on('text', (ctx) => {
    console.log("In getting hour")
    console.log("MESSAGE",ctx.message.text)
    console.log("USERNAME",ctx.from.username)
    let path='./data/users/'+ctx.from.username+".json"
    let courses = fs.readFileSync(pat.join(__dirname,"data/users",ctx.from.username+".json"))
    let slots = fs.readFileSync(pat.join(__dirname,"data","slot.json"))

    let courses_json = JSON.parse(courses);
    let slots_json = JSON.parse(slots);
    let buffer_time=ctx.message.text
    console.log(parseInt(buffer_time))
    // console.log(courses_json)
    // console.log(slots.json)
    let courses_notifying = getCurrentCourses(courses_json,slots_json,parseInt(buffer_time))
    console.log(courses_notifying)

  
    // Using context shortcut
    ctx.reply(`Hello`)
  })
  

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
