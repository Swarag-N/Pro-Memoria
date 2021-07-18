const dt = require("date-and-time");
const Slot = require("../models/Slot");
const SlotTime = require("../models/SlotTime");
const { getNumberTime } = require("./index");

async function getTimeSlots(bufferMin) {
    let time_now = new Date();
    let time_later = dt.addMinutes(time_now, bufferMin);

    let filter = {
        weekday: time_now.getDay(),
        start_time: {
            $gte: getNumberTime(time_now),
            $lte: getNumberTime(time_later),
        },
    };

    return SlotTime.find(filter);
}

function getSlotsfromTimeSlots(time_slots) {
    let dense = time_slots.map((time_slot) => {
        return time_slot.slots_in_time;
    });

    let allSlots = [].concat(...dense);
    return Slot.find({ _id: { $in: allSlots } });
}

function getSubjectiffound(slots, tid) {
    let found_subj = null;
    // TODO returns only one class should collect more classes to
    let flag = slots.some((slot) => {
        let subj = slot.get(`reg_users.${tid}`);
        if (subj) {
            found_subj = subj;
            return true;
        }
        return false;
    });

    return flag, found_subj;
}

function getUsersTobeNotified(time_slots) {
    let dense = time_slots.map((time_slot) => {
        return time_slot.slots_in_time;
    });

    let allSlots = [].concat(...dense);
    return Slot.find({ _id: { $in: allSlots } })
        .populate("reg_users.$*")
        .lean();
}

module.exports = {
    getTimeSlots,
    getSlotsfromTimeSlots,
    getSubjectiffound,
    getUsersTobeNotified,
};
