const fs = require("fs");
const { Telegraf } = require('telegraf')
const needle = require('needle');
const { json } = require("body-parser");
// const {getCurrentCourses} = require('./helpers/app');

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

bot.on('document',(ctx)=>{
    try {
        let fileData= (ctx.update.message.document)
        
        if (fileData.mime_type !== 'application/json'){
            throw Error("Please Send a Valid File")
        }

        console.group(ctx.from)

        needle.get(`https://api.telegram.org/bot${BOT_API}/getFile?file_id=${fileData.file_id}`, {output:"./apple.json"},function(error, response) {
            if (!error && response.statusCode == 200){
                data = JSON.parse(response.raw)
                console.log(data)
            }else{
                throw Error("Please Try Again")
            }
        });
        // {
        //     file_name: 'output.json',
        //     mime_type: 'application/json',
        //     file_id: 'BQACAgUAAxkBAANJYFUgeN546mzmYROvVALLSxfDUdsAAscCAAJpb6hWFhZsF6Pok30eBA',
        //     file_unique_id: 'AgADxwIAAmlvqFY',
        //     file_size: 4613
        //   }


        // fs.writeFileSync("./data/users/")
        // console.log(data)
        ctx.reply("HII IIIIIIIIIIIII")
    } catch (error) {
        console.log(error)
        ctx.reply(error)
        
    }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
