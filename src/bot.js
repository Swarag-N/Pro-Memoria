const { Markup } = require('telegraf');

function addKeyBoard({ reply }) {
  return reply(
    'Choose Your Options',
    Markup.keyboard([
      ['Add Assign/Quiz', 'Next Class'], // Row1 with 2 buttons
      ['All classes in next T minutes'], // Row2 with 2 buttons
    ])
      .oneTime()
      .resize(),
  );
}

function buffTimeSelctionkeyboard(ctx) {
  // Inline Keyboard with Quiz and DA
  const inlineDaQuizKeyboard = Markup.inlineKeyboard([
    Markup.button.callback('15 min', '15'),
    Markup.button.callback('30 min', '30'),
    Markup.button.callback('45 min', '30'),
    Markup.button.callback('1 hour', '60'),
  ]);
  ctx.reply('Select Time frame', inlineDaQuizKeyboard);
}

module.exports = { addKeyBoard, buffTimeSelctionkeyboard };
