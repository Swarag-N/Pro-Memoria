const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // TODO need to disscuss
    // time: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "SlotTime",
    // },
    reg_users: {
        type: Map,
        of: {
            type:'ObjectID',
            ref:'Subject'
        },
        // of: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
});

const Slot = new mongoose.model("Slot", slotSchema);
module.exports = Slot;
