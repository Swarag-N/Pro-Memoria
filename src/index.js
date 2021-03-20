const fs = require("fs");
const Telegraf = require('telegraf');

const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
var Calendar=require('telegraf-calendar-telegram')

const needle = require('needle');
const axios = require('axios');
const { json } = require("body-parser");
const {getCurrentCourses,formatMessage,getAllCourseCodes} = require('./helpers/app');
const pat=require('path')
if (process.env.NODE_ENV){
  const result = require('dotenv').config()
  
  if (result.error) {
    throw result.error
  }
}

var BOT_API = process.env.TELEGRAM_BOT
const courses = process.env.COURSES
const CHAT_ID = process.env.CHAT_ID

BOT_API='1443080989:AAFV55fIuxCO33CwEaBKLXWWMyKEzpNzE9c'
const bot = new Telegraf(BOT_API)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => {
    console.group(ctx.from)
    ctx.reply('Hey there')
})

//====================================

// instantiate the calendar
const calendar = new Calendar(bot, {
	startWeekDay: 0,
	weekDayNames: ["S", "M", "T", "W", "T", "F", "S"],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	],
	minDate: null,
	maxDate: null
});

// listen for the selected date event
var ourformat;
calendar.setDateListener((context, date) => {
	var format=date.split('-')
	// ourformat=format[2]+':'+format[1]+':'+format[0];
    ourformat=format[2]+'-'+format[1]+'-'+format[0];
    console.log(ourformat)
    ourformat=ourformat.replace(/-/g, "\\-");
    console.log(ourformat)
	context.reply(ourformat,{
		parse_mode: 'MarkdownV2',
		// reply_markup: inlineCourseKeyboard
		reply_markup:{
			inline_keyboard:[[{
				text:'Back',
				callback_data:'bk'
			},
			{
				text:'Confirm',
				callback_data:'cf'
			}
		]]
		}
	})
});
bot.action("bk",(ctx) =>{
	const inlineDaQuizKeyboard = Markup.inlineKeyboard([
		Markup.callbackButton('DA', 'da'),
		Markup.callbackButton('QUIZ', 'quiz')
	]).extra()
	ctx.reply('Select DA or QUIZ',inlineDaQuizKeyboard)
}) 

bot.action("cf",(ctx)=>{
    var courses_read = fs.readFileSync(pat.join(__dirname,"data/users",ctx.from.id+".json"))

    var course_json = JSON.parse(courses_read);
    var cobj=getAllCourseCodes(course_json);
    var carr=[];
    for (const [key, value] of Object.entries(cobj)) {
        
        carr.push(key)
    }
	// console.log(carr)
	cmp_sent="you added a assignment for "+ccode+" on "+ourformat;
	ctx.reply(cmp_sent);
})
// retreive the calendar HTML
bot.action("calendar", context => {

	const today = new Date();
	const minDate = new Date();
	minDate.setMonth(today.getMonth() - 2);
	const maxDate = new Date();
	maxDate.setMonth(today.getMonth() + 2);
	maxDate.setDate(today.getDate());

	context.reply("Here you are", calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar())
});
//=====================================

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
            fs.writeFileSync(pat.join(__dirname,"data/users",ctx.from.id+".json"),data)
            
        }

        ctx.reply("Thank You File upload Done")
    } catch (error) {
        console.log(error)
        ctx.reply(error)
        
    }
})

// bot.on('text', (ctx) => {
//     console.log("In getting hour")
//     console.log("MESSAGE",ctx.message.text)
//     console.log("USERNAME",ctx.from.username)
//     let path='./data/users/'+ctx.from.username+".json"
//     let courses = fs.readFileSync(pat.join(__dirname,"data/users",ctx.from.id+".json"))
//     let slots = fs.readFileSync(pat.join(__dirname,"data","slot.json"))

//     let courses_json = JSON.parse(courses);
//     let slots_json = JSON.parse(slots);
//     let buffer_time=ctx.message.text
//     console.log(parseInt(buffer_time))
//     // console.log(courses_json)
//     // console.log(slots.json)
//     let courses_notifying = getCurrentCourses(courses_json,slots_json,parseInt(buffer_time))
//     console.log(courses_notifying)
//     let msg=formatMessage(courses_notifying)
  
//     // Using context shortcut
//     ctx.reply(msg)
// })
  
//Keyboard coding
bot.command('keyboard', ({ reply }) => {
	return reply('Custom buttons keyboard', Markup
	  .keyboard([
		['Add Assign/Quiz', 'Next Class'], // Row1 with 2 buttons
		['All classes in next T minutes'], // Row2 with 2 buttons
		['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
	  ])
	  .oneTime()
	  .resize()
	  .extra()
	)
})

bot.hears('All classes in next T minutes', ctx => {
	// Inline Keyboard with Quiz and DA
	const inlineDaQuizKeyboard = Markup.inlineKeyboard([
		Markup.callbackButton('15 min', '15'),
		Markup.callbackButton('30 min', '30'),
        Markup.callbackButton('45 min', '30'),
        Markup.callbackButton('1 hour', '60')
	]).extra()
	ctx.reply('Select Time frame',inlineDaQuizKeyboard)
})
const timeframes=['15','30','45','60']
bot.action(timeframes, (ctx) => {
    console.log(ctx.match)
	var buffer_time=ctx.match
    console.log("USERNAME",ctx.from.username)
    // let path='./data/users/'+ctx.from.username+".json"
    let courses = fs.readFileSync(pat.join(__dirname,"data/users",ctx.from.id+".json"))
    let slots = fs.readFileSync(pat.join(__dirname,"data","slot.json"))

    let courses_json = JSON.parse(courses);
    let slots_json = JSON.parse(slots);
   
    console.log(parseInt(buffer_time))
    // console.log(courses_json)
    // console.log(slots.json)
    let courses_notifying = getCurrentCourses(courses_json,slots_json,parseInt(buffer_time))
    console.log(courses_notifying)
    let msg=formatMessage(courses_notifying)
    console.log(msg)
    msg=msg.replace("_", "\\_")
    .replace("*", "\\*")
    .replace("-", "\\-")
    .replace("`", "\\`")
    .replace("(","\\(")
    .replace(")","\\)");
    ctx.deleteMessage();
    ctx.reply(msg,{
		parse_mode: 'MarkdownV2',
		// reply_markup: inlineCourseKeyboard
		reply_markup:{
			inline_keyboard:[[{
				text:'Back',
				callback_data:'back'
			},
			// {
			// 	text:'Confirm',
			// 	callback_data:'confirm'
			// }
		]]
		}
	})
})

bot.action("back",(ctx) =>{
    const inlineDaQuizKeyboard = Markup.inlineKeyboard([
		Markup.callbackButton('15 min', '15'),
		Markup.callbackButton('30 min', '30'),
        Markup.callbackButton('45 min', '30'),
        Markup.callbackButton('1 hour', '60')
	]).extra()
	ctx.reply('Select Time frame',inlineDaQuizKeyboard)
}) 

// bot.action("confirm",(ctx)=>{
// 	cmp_sent="you add a "+da_quiz+" for "+ccode+" on "+ourformat;
// 	ctx.reply(cmp_sent);
// })

bot.hears('Add Assign/Quiz', ctx => {
	// Inline Keyboard with Quiz and DA
	const inlineDaQuizKeyboard = Markup.inlineKeyboard([
		Markup.callbackButton('DA', 'da'),
		Markup.callbackButton('QUIZ', 'quiz')
	]).extra()
	ctx.reply('Select DA or QUIZ',inlineDaQuizKeyboard)
})


bot.action('da', (ctx) => {
	// da_quiz="Digital Assignment"

    var courses_read = fs.readFileSync(pat.join(__dirname,"data/users",ctx.from.id+".json"))

    var course_json = JSON.parse(courses_read);
    var cobj=getAllCourseCodes(course_json);
    var carr=[];
    for (const [key, value] of Object.entries(cobj)) {
        console.log(`${key}: ${value}`);
        carr.push(key)
    }
	console.log(carr)
    var out=courses_keyboard(carr)
	// const inlineCourseKeyboard = Markup.inlineKeyboard(carr)
	// ctx.editMessageText('Select course',inlineCourseKeyboard)
	ctx.deleteMessage();
	ctx.reply('Select Course',{
		parse_mode: 'MarkdownV2',
		// reply_markup: inlineCourseKeyboard
		reply_markup:{
			inline_keyboard:out
		}
	})
	
})

// bot.action(carr,(ctx)=>{
// 	// console.log(ctx)
// 	console.log(ctx.match)
// 	ccode=ctx.match
//     courses_read = fs.readFileSync(pat.join(__dirname,"data/users",ctx.from.id+".json"))

//     course_json = JSON.parse(courses_read);
//     cobj=getAllCourseCodes(course_json);
//     // carr=[];
//     for (const [key, value] of Object.entries(cobj)) {
//         console.log(`${key}: ${value}`);
//         carr.push(key)
//     }
// 	console.log(carr)
    
//     console.log(cobj)
    
// 	ctx.editMessageText('Select Deadline For your Assignment',{
// 		parse_mode: 'MarkdownV2',
// 		// reply_markup: inlineCourseKeyboard
// 		reply_markup:{
// 			inline_keyboard:[[{
//                 text:'Select Date',
//                 callback_data:'calendar'
//             }]]
// 		}
// 	})
// })

bot.on('callback_query',(ctx)=>{
    console.log(ctx)
	console.log(ctx.update.callback_query.data)
	// console.log(ctx.message.text)
	ccode=ctx.update.callback_query.data
    console.log("INSIDE")
    ctx.answerCbQuery()
    courses_read = fs.readFileSync(pat.join(__dirname,"data/users",ctx.from.id+".json"))

    course_json = JSON.parse(courses_read);
    cobj=getAllCourseCodes(course_json);
    if(cobj[ccode]){
        console.log("Yes course code Phase")
        carr=[];
        for (const [key, value] of Object.entries(cobj)) {
            // console.log(`${key}: ${value}`);
            carr.push(key)
        }
        // console.log(carr)
        
        // console.log(cobj)
        
        ctx.editMessageText('Select Deadline For your Assignment',{
            parse_mode: 'MarkdownV2',
            // reply_markup: inlineCourseKeyboard
            reply_markup:{
                inline_keyboard:[[{
                    text:'Select Date',
                    callback_data:'calendar'
                }]]
            }
        })

    }
    else{
        ctx.reply("Hello Other than course code")
        // ctx.answerCbQuery("Hello")
    }
    
})

bot.launch()

function courses_keyboard(courses){
	var arr=[]
	var temp=[]
	
	while(courses.length>0){
		temp.push(courses.splice(0,3))
	}
    for(var i=0;i<temp.length;i++){
		var qwe=[]
        for(var j=0;j<temp[i].length;j++){
            let obj={
                text:temp[i][j],
                callback_data:temp[i][j]
            }
            qwe.push(obj)
        }
        arr.push(qwe)
    }
	
	// arr.push(Markup.callbackButton(courses[i], courses[i]))
	
	// console.log(arr)
	return arr;
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
