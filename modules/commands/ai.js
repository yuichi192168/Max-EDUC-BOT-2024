const axios = require('axios');
const Tesseract = require('tesseract.js');

// Placeholder function for image-to-text conversion
async function convertImageToText(imageURL) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imageURL,
      'eng',
      { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
      resolve(text);
    }).catch(error => {
      console.error(error);
      reject(error);
    });
  });
} 

module.exports.config = {
  name: "ai",
  version: "2.1.3",
  hasPermission: 0,
  credits: "Max Spencer (API by Hazeyy Wu)",
  usePrefix: true,
  description: "(GPT/ImageRecognition)",
  commandCategory: "ai",
  usages: "(GPT-4)",
  cooldowns: 0,
};

module.exports.handleEvent = async function ({ api, event }) {
if (!(event.body.startsWith("ai") || event.body.startsWith("AI"))) return;

  const { threadID, messageID, type, messageReply, body } = event;

  let question = '';

  if (type === 'message_reply') {
    if (messageReply?.attachments[0]?.type === 'photo') {
      const attachment = messageReply.attachments[0];
      const imageURL = attachment.url;
      question = await convertImageToText(imageURL);

      if (!question) {
        api.sendMessage('𝖴𝗇𝖺𝖻𝗅𝖾 𝗍𝗈 𝖼𝗈𝗇𝗏𝖾𝗋𝗍 𝗍𝗁𝖾 𝗉𝗁𝗈𝗍𝗈, 𝗉𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗌𝗎𝗋𝖾 𝗂𝗆𝖺𝗀𝖾𝗌 𝖺𝗋𝖾 𝖼𝗅𝖾𝖺𝗋 𝖻𝖾𝖿𝗈𝗋𝖾 𝗌𝖾𝗇𝖽𝗂𝗇𝗀.', threadID, messageID);
        return;
      }
    } else {
      question = messageReply?.body?.trim() || '';
    }
  } else { 
    question = body.slice(5).trim();
  }

  try {
    api.sendTypingIndicator(event.threadID);

    const response = await axios.get(`https://hazeyy-gpt4-api.kyrinwu.repl.co/api/gpt4/v-3beta?content=${encodeURIComponent(question)}`);

    const reply = response.data.reply;

    if (reply.trim() !== "") {
      api.sendMessage(`${reply}`, event.threadID);
    } else {
      api.sendMessage("couldn't provide a response to your query.", event.threadID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("an error occured. Please try again later.", event.threadID);
  }
};

module.exports.run = async function ({ api, event }) {};