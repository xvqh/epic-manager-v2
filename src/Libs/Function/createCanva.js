const { createCanvas } = require('canvas');

module.exports = async (text, title) => {
  text = removeEmojis(text);
  const fontFamily = 'Sherif';
  const fontSize = 50;
  const lineHeight = fontSize * 1.2;

  const lines = text.split('\n');

  const maxLineWidth = lines.reduce((maxWidth, line) => {
    const lineWidth = measureTextWidth(line, fontFamily, fontSize);
    return Math.max(maxWidth, lineWidth);
  }, 0);

  const textHeight = lines.length * lineHeight;

  const titleHeight = lineHeight;

  const canvas = createCanvas(maxLineWidth + 20, textHeight + titleHeight + 20);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#000033');
  gradient.addColorStop(1, '#000066');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeText(title, canvas.width / 2, fontSize / 2 + titleHeight / 2 + 10);

  ctx.fillText(title, canvas.width / 2, fontSize / 2 + titleHeight / 2 + 10);

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'start';

  lines.forEach((line, index) => {
    const x = 10;
    const y = titleHeight + 5 + (index + 1) * lineHeight;

    ctx.fillText(line, x, y);
  });

  return canvas;
}

function measureTextWidth(text, fontFamily, fontSize) {
  const canvas = createCanvas(1, 1);
  const ctx = canvas.getContext('2d');
  ctx.font = `${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
}

function removeEmojis(text) {
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F9FF}\u{1F3FB}-\u{1F3FF}\u{1F400}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2300}-\u{23FF}\u{2900}-\u{297F}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F9FF}]/gu;
  const textWithoutEmojis = text.replace(emojiRegex, '');
  return textWithoutEmojis;
}
