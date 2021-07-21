const fs = require("fs");
const pat = require("path");

const { Telegraf, Markup, } = require('telegraf')
const { MongoClient } = require("mongodb");
const { session } = require("telegraf-session-mongodb");


const db = require("./models/db");
const {
    getCurrentCourses,
    formatMessage,
    getAllCourseCodes,
} = require("./helpers/app");

const { welcome, classInNextTMin } = require("./controllers/index");
const fileUpload = require('./handlers/fileHandler')
const { addKeyBoard, buffTimeSelctionkeyboard } = require("./bot");
const { TIMEFRAMES } = require('./bot/VALUES')

if (process.env.NODE_ENV == "development ") {
    let tk = require("timekeeper");
    console.log("In Testing");
    let buf = new Date(2021, 02, 19, 16, 45);
    let time = new Date(buf.getTime()); // January 1, 2030 00:00:00
    tk.travel(time);
    console.log(new Date().toTimeString());
}

if (process.env.NODE_ENV) {
    const result = require("dotenv").config();

    if (result.error) {
        throw result.error;
    }
}

const BOT_API = process.env.TELEGRAM_BOT;


db.connectToDB();
const bot = new Telegraf(BOT_API);

bot.start(welcome);
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => {
    ctx.reply("Hey there");
});
bot.on("document", fileUpload);

MongoClient.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        const db = client.db();
        bot.use(session(db, { collectionName: 'sessions' }));
        bot.launch()
    });


bot.action("bk", (ctx) => {
    const inlineDaQuizKeyboard = Markup.inlineKeyboard([
        Markup.button.callback("DA", "da"),
        Markup.button.callback("QUIZ", "quiz"),
    ]);
    ctx.reply("Select DA or QUIZ", inlineDaQuizKeyboard);
});

bot.action("cf", (ctx) => {
    var courses_read = fs.readFileSync(
        pat.join(__dirname, "data/users", ctx.from.id + ".json")
    );

    var course_json = JSON.parse(courses_read);
    var cobj = getAllCourseCodes(course_json);

    // cmp_sent="you added a assignment for "+ccode+" on "+ourformat;
    ctx.deleteMessage();
    console.log("COUSE CODE SESSION CHECKING", ctx.session.ccode);
    console.log("Date checking", ctx.session.ourformat);
    var cname = cobj[ctx.session.ccode].name;
    var cmp_sent = `You added Da on ${ctx.session.ourformat} for Course ${cname}`;
    ctx.reply(cmp_sent);
});




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

bot.command("keyboard", addKeyBoard);
bot.hears("All classes in next T minutes", buffTimeSelctionkeyboard);

bot.action(TIMEFRAMES, classInNextTMin);

bot.action("back", (ctx) => {
    const inlineDaQuizKeyboard = Markup.inlineKeyboard([
        Markup.button.callback("15 min", "15"),
        Markup.button.callback("30 min", "30"),
        Markup.button.callback("45 min", "30"),
        Markup.button.callback("1 hour", "60"),
    ]).extra();
    ctx.reply("Select Time frame", inlineDaQuizKeyboard);
});

// bot.action("confirm",(ctx)=>{
// 	cmp_sent="you add a "+da_quiz+" for "+ccode+" on "+ourformat;
// 	ctx.reply(cmp_sent);
// })

bot.hears("Add Assign/Quiz", (ctx) => {
    // Inline Keyboard with Quiz and DA
    const inlineDaQuizKeyboard = Markup.inlineKeyboard([
        Markup.button.callback("DA", "da"),
        Markup.button.callback("QUIZ", "quiz"),
    ]);
    ctx.reply("Select DA or QUIZ", inlineDaQuizKeyboard);
});

bot.action("da", (ctx) => {
    // da_quiz="Digital Assignment"

    // var courses_read = fs.readFileSync(
    //     pat.join(__dirname, "data/users", ctx.from.id + ".json")
    // );

    // var course_json = JSON.parse(courses_read);
    // var cobj = getAllCourseCodes(course_json);
    // var carr = [];
    // for (const [key, value] of Object.entries(cobj)) {
    //     console.log(`${key}: ${value}`);
    //     carr.push(key);
    // }
    // console.log(carr);
    // var out = courses_keyboard(carr);
    // ctx.deleteMessage();
    ctx.reply("Select Course", {
        parse_mode: "MarkdownV2",
        reply_markup: {
            inline_keyboard: ["FFFF"],
        },
    });
});



bot.on("callback_query", (ctx) => {
    console.log(ctx);
    console.log(ctx.update.callback_query.data);
    // console.log(ctx.message.text)
    ccode = ctx.update.callback_query.data;
    console.log("INSIDE");
    ctx.answerCbQuery();
    courses_read = fs.readFileSync(
        pat.join(__dirname, "data/users", ctx.from.id + ".json")
    );

    course_json = JSON.parse(courses_read);
    cobj = getAllCourseCodes(course_json);
    if (cobj[ccode]) {
        console.log("Yes course code Phase");
        carr = [];
        for (const [key, value] of Object.entries(cobj)) {
            // console.log(`${key}: ${value}`);
            carr.push(key);
        }
        // console.log(carr)
        ctx.session.ccode = ccode;

        ctx.editMessageText("Select Deadline For your Assignment", {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Select Date",
                            callback_data: "calendar",
                        },
                    ],
                ],
            },
        });
    } else {
        ctx.reply("Hello Other than course code");
    }
});

// bot.launch();

function courses_keyboard(courses) {
    var arr = [];
    var temp = [];

    while (courses.length > 0) {
        temp.push(courses.splice(0, 3));
    }
    for (var i = 0; i < temp.length; i++) {
        var qwe = [];
        for (var j = 0; j < temp[i].length; j++) {
            let obj = {
                text: temp[i][j],
                callback_data: temp[i][j],
            };
            qwe.push(obj);
        }
        arr.push(qwe);
    }

    return arr;
}

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
