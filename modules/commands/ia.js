const Tesseract = require('tesseract.js');

// Placeholder function for image-to-text conversion
async function convertImageToText(imageURL) {
  try {
    const { data: { text } } = await Tesseract.recognize(imageURL, 'eng', { logger: info => console.log(info) });
    return text;
  } catch (error) {
    console.error(error);
    throw new Error('Error converting image to text');
  }
}

module.exports.config = {
  name: 'ia',
  version: '2.1.3',
  hasPermission: 0,
  credits: 'Max Spencer(API by Hazeyy Wu)',
  usePrefix: true,
  description: '(Image to text)',
  commandCategory: 'ai',
  usages: '(image-to-text)',
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.startsWith('ia') || event.body.startsWith('IA'))) return;

  const { threadID, messageID, type, messageReply } = event;

  let question = '';

  if (type === 'message_reply') {
    if (messageReply?.attachments[0]?.type === 'photo') {
      const attachment = messageReply.attachments[0];
      const imageURL = attachment.url;
      try {
        question = await convertImageToText(imageURL);
      } catch (error) {
        console.error(error);
        api.sendMessage('❗ Error converting the image to text.', threadID, messageID);
        return;
      }

      if (!question) {
        api.sendMessage('❗ Unable to convert the photo to text. Please ensure the images are clear before sending.', threadID, messageID);
        return;
      }

      api.sendMessage(`${question}`, threadID);
    } else {
      api.sendMessage('❗ Please reply to a photo to convert it to text.', threadID, messageID);
    }
  } else {
    api.sendMessage('❗ Please reply to a photo to convert it to text.', threadID, messageID);
  }
};
