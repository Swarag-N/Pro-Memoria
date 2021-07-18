const { getTimeSlots, getUsersTobeNotified } = require('../helpers/backbone');

async function sendNotificationOfClass(bot) {
  const time_slots = await getTimeSlots(200);
  const slots_in_time = await getUsersTobeNotified(time_slots);
  console.log(slots_in_time);
  slots_in_time.forEach((slot) => {
    console.log(slot);
  });
}

module.exports = { sendNotificationOfClass };
