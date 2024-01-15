module.exports.config = {
    name: "uptime",
    version: "1.0.1",
    hasPermission: 0,
    credits: "Mirai Team",
    usePrefix: true,
    description: "Check how long the bot has been online",
    commandCategory: "system",
    cooldowns: 5,
    dependencies: {
        "pidusage": ""
    }
};

function byte2mb(bytes) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(bytes, 10) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

module.exports.run = async ({ api, event }) => {
    const time = process.uptime();
    const hours = Math.floor(time / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = Math.floor(time % 60); // Fixed this line

    const pidusage = await global.nodemodule["pidusage"](process.pid);

    const timeStart = Date.now();
    return api.sendMessage("", event.threadID, () => api.sendMessage(`Bot has been active for ${hours} hours ${minutes} minutes ${seconds} seconds.\n\n❯ Total users: ${global.data.allUserID.length}\n❯ Total Groups: ${global.data.allThreadID.length}\n❯ CPU usage: ${pidusage.cpu.toFixed(1)}%\n❯ RAM usage: ${byte2mb(pidusage.memory)}\n❯ Ping: ${Date.now() - timeStart}ms`, event.threadID, event.messageID));
}
