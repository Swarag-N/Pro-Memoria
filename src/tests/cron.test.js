const { sendNotificationOfClass } = require("../cronTasks/classReminders");
const Slot = require("../models/Slot");
const User = require("../models/User");
const Subject = require("../models/Subject");
const db = require("../models/db");

if (process.env.NODE_ENV) {
    const result = require("dotenv").config();
    console.log("Hii");
    if (result.error) {
        throw result.error;
    }

    console.log(new Date().getTime())
}
db.connectToDB()

sendNotificationOfClass("hi");
