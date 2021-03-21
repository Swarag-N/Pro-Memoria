const fs = require('fs')
const path = require('path')

const axios = require('axios')
const User = require('../models/User')
const {createUser} = require('./user.controller')

function welcome(ctx){

    try {
        console.log(ctx.from)
        User.findOne({tid:ctx.from.id},((error,user)=>{
            if(error) throw error
            let msg = ""
            console.log(user)
            if(user){
                msg = "WelCome Back, please share your timetable for getting reminders"
            }else{
                createUser(ctx.from)
                msg = "Hello there"
            }
            ctx.reply(msg)
        }))
        
    } catch (error) {
        console.log(error)
        ctx.reply("There is servor issue, Try again Later")
    }


}


async function fileUpload(ctx){

        try {
            let msg = ""
            let fileData = (ctx.update.message.document)
            
            if (fileData.mime_type !== 'application/json') {
                throw ReferenceError("Please Send a Valid File")
            }

            const fileUrl = await ctx.telegram.getFileLink(fileData.file_id)
            const response = await axios.get(fileUrl);

            if (response.status === 200 || statusText === "OK") {
                let data = JSON.stringify(response.data);
                msg = "You'r Previous Data is Replaced with this DATA"
                let filePath = path.join(__dirname,'../', "data/users", ctx.from.id + ".json")
                if (!fs.existsSync(filePath)) {
                    msg = "You'r Data is Added"
                }
                console.log(data)
                fs.writeFileSync(filePath, data)
            }
    
            ctx.reply(msg)
        } catch (error) {
            if (error instanceof ReferenceError){
                ctx.reply(error.message)
            }else{
                console.log(error)
                ctx.reply("There is a Server error please \n Try again later")
            }
        }
}

module.exports = {fileUpload,welcome}