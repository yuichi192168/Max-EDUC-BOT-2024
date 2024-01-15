module.exports = async ({ api }) => {
  const logger = require('./utils/log');
  const cron = require('node-cron');
  const fs = require('fs');
  const yandeva = {
    autoRestart: {
      status: true,
      time: 30, // 45 minutes
      note: 'To avoid problems, enable periodic bot restarts'
    },
    accpetPending: {
      status: false,
      time: 30, // 30 minutes
      note: 'Approve waiting messages after a certain time'
    }
  }

  function autoRestart(config) {
    if (config.status) {
      setInterval(async () => {
        logger(`Start rebooting the system!`, "[ Auto Restart ]")
        process.exit(1);
      }, config.time * 60 * 1000);
    }
  }

  function accpetPending(config) {
    if (config.status) {
      setInterval(async () => {
        const list = [
          ...(await api.getThreadList(1, null, ['PENDING'])),
          ...(await api.getThreadList(1, null, ['OTHER']))
        ];
        if (list[0]) {
          api.sendMessage('You have been approved for the queue. (This is an automated message)', list[0].threadID);
        }
      }, config.time * 60 * 1000);
    }
  }

  autoRestart(yandeva.autoRestart);
  accpetPending(yandeva.accpetPending);

  cron.schedule('*/30 * * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('*/10 * * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });
};
