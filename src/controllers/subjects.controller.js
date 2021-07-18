const Subject = require("../models/Subject");
const Slot = require("../models/Slot");

async function addSubject(subject, user_tid) {
    let {
        slot,
        type,
        CCode,
        CName: name,
        LTPJC,
        category,
        classRoom,
        fName: fname,
    } = subject;

    let newSubj = await Subject.findOneAndUpdate(
        { name, CCode, fname, classRoom },
        { type, LTPJC: LTPJC.join(" "), category },
        { upsert: true, new: true }
    )
        .exec()
        .then((subject) => {
            return subject;
        })
        .catch((err) => {
            throw err;
        });

    let lower_slots = slot.map((s) => s.toLowerCase());
    let allSlots = await [].concat(...lower_slots);
    let req_slots = await Slot.find({ name: { $in: allSlots } })
        .exec()
        .then((slots) => {
            // console.log(slots);
            return slots;
        })
        .catch((err) => {
            throw err;
        });

    let slots_in_which_data_added = [];
    req_slots.forEach(async (foundSlot) => {
        await foundSlot.set(`reg_users.${user_tid}`, newSubj._id);
        await foundSlot.save();
        await slots_in_which_data_added.push(foundSlot.name)
    });
    console.log(slots_in_which_data_added);
    return slots_in_which_data_added;
}

module.exports = { addSubject };
