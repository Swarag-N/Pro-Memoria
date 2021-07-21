const Calendar = require('telegraf-calendar-telegram');
//= ===================================
// instantiate the calendar
//
// TODO: V2 Pass Calendar Action like File Handler
bot.action('calendar', (context) => {
  const today = new Date();
  const minDate = new Date();
  minDate.setMonth(today.getMonth() - 2);
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);
  maxDate.setDate(today.getDate());

  context.reply(
    'Here you are',
    calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar(),
  );
});

// TODO: Get Calendar Working
const calendar = new Calendar(bot, {
  startWeekDay: 0,
  weekDayNames: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  monthNames: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  minDate: null,
  maxDate: null,
});

// listen for the selected date event

calendar.setDateListener((context, date) => {
  const format = date.split('-');
  // ourformat=format[2]+':'+format[1]+':'+format[0];
  let ourformat = `${format[2]}-${format[1]}-${format[0]}`;
  console.log(ourformat);
  ourformat = ourformat.replace(/-/g, '\\-');
  console.log(ourformat);
  context.session.ourformat = ourformat;
  context.reply(ourformat, {
    parse_mode: 'MarkdownV2',
    // reply_markup: inlineCourseKeyboard
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Back',
            callback_data: 'bk',
          },
          {
            text: 'Confirm',
            callback_data: 'cf',
          },
        ],
      ],
    },
  });
});

// bot.action(carr,(ctx)=>{
// 	// console.log(ctx)
// 	console.log(ctx.match)
// 	ccode=ctx.match
//     courses_read = fs.readFileSync(pat.join(__dirname,"data/users",ctx.from.id+".json"))

//     course_json = JSON.parse(courses_read);
//     cobj=getAllCourseCodes(course_json);
//     // carr=[];
//     for (const [key, value] of Object.entries(cobj)) {
//         console.log(`${key}: ${value}`);
//         carr.push(key)
//     }
// 	console.log(carr)

//     console.log(cobj)

// 	ctx.editMessageText('Select Deadline For your Assignment',{
// 		parse_mode: 'MarkdownV2',
// 		// reply_markup: inlineCourseKeyboard
// 		reply_markup:{
// 			inline_keyboard:[[{
//                 text:'Select Date',
//                 callback_data:'calendar'
//             }]]
// 		}
// 	})
// })

module.exports = { calendar };
