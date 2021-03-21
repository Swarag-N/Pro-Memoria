const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  reg_users: {
    type: Map,
    of: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
});

const Slot = new mongoose.model("Slot", slotSchema);
module.exports = Slot;
