const fs = require("fs");
const path = require("path");

const axios = require("axios");
const User = require("../models/User");
const { createUser } = require("./user.controller");
const { addSubject } = require("./subjects.controller");
const {
    getTimeSlots,
    getSlotsfromTimeSlots,
    getSubjectiffound,
} = require("../helpers/backbone");
const { formatSubjectMessage } = require("../helpers/app");
const Subject = require("../models/Subject");

function welcome(ctx) {
    try {
        console.log(ctx.from);
        User.findOne({ tid: ctx.from.id }, (error, user) => {
            if (error) throw error;
            let msg = "";
            console.log(user);
            if (user) {
                msg =
                    "WelCome Back, please share your timetable for getting reminders";
            } else {
                createUser(ctx.from);
                msg = "Hello there";
            }
            ctx.reply(msg);
        });
    } catch (error) {
        console.log(error);
        ctx.reply("There is servor issue, Try again Later");
    }
}

async function fileUpload(ctx) {
    try {
        let msg = "";
        let fileData = ctx.update.message.document;

        if (fileData.mime_type !== "application/json") {
            throw ReferenceError("Please Send a Valid File");
        }

        const fileUrl = await ctx.telegram.getFileLink(fileData.file_id);
        const response = await axios.get(fileUrl);

        if (response.status === 200 || statusText === "OK") {
            let data = JSON.stringify(response.data);
            // msg = "You'r Previous Data is Replaced with this DATA"
            // let filePath = path.join(__dirname,'../', "data/users", ctx.from.id + ".json")
            // if (!fs.existsSync(filePath)) {
            msg = "You'r Data is Added";
            // }
            let subjs = JSON.parse(data);
            let slots_added = []
            subjs.forEach(async (subj) => {
                let temp_slot =  await addSubject(subj, ctx.from.id);
                console.log(temp_slot)
                slots_added.push(...temp_slot)
            });
            console.log(slots_added,"******************");

            // fs.writeFileSync(filePath, data)
        }

        ctx.reply(msg);
    } catch (error) {
        if (error instanceof ReferenceError) {
            ctx.reply(error.message);
        } else {
            console.log(error);
            ctx.reply("There is a Server error please \n Try again later");
        }
    }
}

async function classInNextTMin(ctx) {
    // console.log(ctx.match)
    let buffer_time = ctx.match;
    console.log("USERNAME", ctx.from.username);
    // let path='./data/users/'+ctx.from.username+".json"
    try {
        let msg = "You Have No Class in Time you gave";
        console.log(new Date());
        let upcomming_time_slost = await getTimeSlots(buffer_time);
        let upcomming_slots = await getSlotsfromTimeSlots(upcomming_time_slost);
        let found = await getSubjectiffound(upcomming_slots, ctx.from.id);
        if (found) {
            let subj = await Subject.findById(found)
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
module.exports = { welcome, fileUpload, classInNextTMin };
