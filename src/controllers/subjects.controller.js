const Subject = require('../models/Subject');
const Slot = require('../models/Slot');

async function addSubject(subject, user_tid) {
  const {
    slot,
    type,
    CCode,
    CName: name,
    LTPJC,
    category,
    classRoom,
    fName: fname,
  } = subject;

  const newSubj = await Subject.findOneAndUpdate(
    {
      name, CCode, fname, classRoom,
    },
    { type, LTPJC: LTPJC.join(' '), category },
    { upsert: true, new: true },
  )
    .exec()
    .then((subject) => subject)
    .catch((err) => {
      throw err;
    });

  const lower_slots = slot.map((s) => s.toLowerCase());
  const allSlots = await [].concat(...lower_slots);
  const req_slots = await Slot.find({ name: { $in: allSlots } })
    .exec()
    .then((slots) =>
    // console.log(slots);
      slots)
    .catch((err) => {
      throw err;
    });

  const slots_in_which_data_added = [];
  req_slots.forEach(async (foundSlot) => {
    await foundSlot.set(`reg_users.${user_tid}`, newSubj._id);
    await foundSlot.save();
    await slots_in_which_data_added.push(foundSlot.name);
  });
  console.log(slots_in_which_data_added);
  return slots_in_which_data_added;
}

module.exports = { addSubject };
