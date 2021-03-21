const mongoose = require("mongoose");

const slotTimeSchema = new mongoose.Schema({
    weekday: { type: Number, required: true },
    start_time: { type: Number, required: true },
    // TODO Disscuss and Add
    // end_time: { type: Number, required: true },
    slots_in_time: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Slot",
        },
    ],
});

const SlotTime = new mongoose.model("SlotTime", slotTimeSchema);
module.exports = SlotTime;