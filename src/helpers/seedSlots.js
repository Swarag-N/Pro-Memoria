const db = require("../models/db");
const Slot = require("../models/Slot");
const SlotTime = require("../models/SlotTime");

if (process.env.NODE_ENV) {
    const result = require("dotenv").config();
    console.log("Hii");
    if (result.error) {
        throw result.error;
    }
}

db.connectToDB();

const slots = require("../data/slot.json");

let allSlots = [].concat(...slots);

// DONT KEEP IN FUNCTION
allSlots.forEach(async (slot) => {
    const { day: weekday, timing, name } = slot;
    if (!timing || !name) {
        return;
    }

    let newSlot = await Slot.findOneAndUpdate(
        { name },
        {},
        { upsert: true, new: true }
    )
        .exec()
        .then((slots) => {
            return slots;
        })
        .catch((err) => {
            throw err;
        });

    const [start_time, _] = timing
        .split("-")
        .map((timee) => parseInt(timee.replace(":", "")));

    let current_slot_time = await SlotTime.findOneAndUpdate(
        { weekday, start_time },
        {
            $addToSet: {
                slots_in_time: newSlot._id,
            },
        },
        { upsert: true, new: true }
    )
        .exec()
        .then((slot_time) => {
            console.log("1")
            return slot_time;
        })
        .catch((err) => {
            throw err;
        });
});
// let current_day = SlotTime.findOrCreate()
// });
