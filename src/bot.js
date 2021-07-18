const { Markup } = require('telegraf');

function addKeyBoard({ reply }) {
  return reply(
    'Choose Your Options',
    Markup.keyboard([
      ['Add Assign/Quiz', 'Next Class'], // Row1 with 2 buttons
      ['All classes in next T minutes'], // Row2 with 2 buttons
    ])
      .oneTime()
      .resize()
      .extra(),
  );
}

function buffTimeSelctionkeyboard(ctx) {
  // Inline Keyboard with Quiz and DA
  const inlineDaQuizKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton('15 min', '15'),
    Markup.callbackButton('30 min', '30'),
    Markup.callbackButton('45 min', '30'),
    Markup.callbackButton('1 hour', '60'),
  ]).extra();
  ctx.reply('Select Time frame', inlineDaQuizKeyboard);
}

module.exports = { addKeyBoard, buffTimeSelctionkeyboard };
