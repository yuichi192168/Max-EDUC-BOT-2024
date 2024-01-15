module.exports = function({ api }) {
	const Users = require("./database/users")({ api });
	const Threads = require("./database/threads")({ api });
	const Currencies = require("./database/currencies")({ api, Users });
	const logger = require("../utils/log.js");
  const chalk = require("chalk");
  const gradient= require("gradient-string");
  const cons = require('./../config.json');
  const theme = cons.DESIGN.Theme.toLowerCase();
  let cra;
  let co;
  let cb;
if (theme === 'blue') {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("#243aff", "#4687f0", "#5800d4");
  cb = chalk.blueBright;
} else if (theme.toLowerCase() === 'dark') {
  // Dark theme colors
  cra = gradient('#2ecc71', '#3498db', '#8e44ad');
  co = gradient("#333", "#555", "#777");
  cb = chalk.gray;
  cv = chalk.bold.hex("#e74c3c");
} else if (theme.toLowerCase() === 'gray') {
  // Gray theme colors
  cra = gradient('#7f8c8d', '#95a5a6', '#bdc3c7');
  co = gradient("#424949", "#626567", "#7f8c8d");
  cb = chalk.gray;
  cv = chalk.bold.hex("#34495e");
} else if (theme.toLowerCase() === 'darkgray') {
  // Dark Gray theme colors
  cra = gradient('#596275', '#34495e', '#2c3e50');
  co = gradient("#2c3e50", "#34495e", "#596275");
  cb = chalk.gray;
  cv = chalk.bold.hex("#95a5a6");
}else if (theme === 'fiery') {
  cra = gradient('orange', 'yellow', 'yellow');
  co = gradient("#fc2803", "#fc6f03", "#fcba03");
  cb = chalk.hex("#fff308");
} else if (theme === 'red') {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("red", "orange");
  cb = chalk.hex("#ff0000");
} else if (theme === 'aqua') {
  cra = gradient("#6883f7", "#8b9ff7", "#b1bffc")
  co = gradient("#0030ff", "#4e6cf2");
  cb = chalk.hex("#3056ff");
} else if (theme === 'pink') {
  cra = gradient('purple', 'pink');
  co = gradient("#d94fff", "purple");
  cb = chalk.hex("#6a00e3");
} else if (theme.toLowerCase() === 'retro') {
  cra = gradient("orange", "purple");
  co = gradient.retro;
  cb = chalk.hex("#ffce63");
} else if (theme.toLowerCase() === 'sunlight') {
  cra = gradient("#f5bd31", "#f5e131");
  co = gradient("#ffff00", "#ffe600");
  cb = chalk.hex("#faf2ac");
} else if (theme.toLowerCase() === 'teen') {
  cra = gradient("#81fcf8", "#853858");
  co = gradient.teen;
  cb = chalk.hex("#a1d5f7");
} else if (theme.toLowerCase() === 'summer') {
  cra = gradient("#fcff4d", "#4de1ff");
  co = gradient.summer;
  cb = chalk.hex("#ffff00");
} else if (theme.toLowerCase() === 'flower') {
  cra = gradient("yellow", "yellow", "#81ff6e");
  co = gradient.pastel;
  cb = gradient('#47ff00', "#47ff75");
} else if (theme.toLowerCase() === 'ghost') {
  cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
  co = gradient.mind;
  cb = chalk.blueBright;
  cv = chalk.bold.hex("#1390f0");
} else if (theme === 'hacker') {
  cra = chalk.hex('#4be813');
  co = gradient('#47a127', '#0eed19', '#27f231');
  cb = chalk.hex("#22f013");
} else {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("#243aff", "#4687f0", "#5800d4");
  cb = chalk.blueBright;
}
//////////////////////////////////////////////////////////////////////
	//========= Push all variable from database to environment =========//
	//////////////////////////////////////////////////////////////////////
	
	(async function () {
		try {
			const [threads, users] = await Promise.all([Threads.getAll(), Users.getAll(['userID', 'name', 'data'])]);
			threads.forEach(data => {
				const idThread = String(data.threadID);
				global.data.allThreadID.push(idThread);
				global.data.threadData.set(idThread, data.data || {});
				global.data.threadInfo.set(idThread, data.threadInfo || {});
				if (data.data && data.data.banned) {
					global.data.threadBanned.set(idThread, {
						'reason': data.data.reason || '',
						'dateAdded': data.data.dateAdded || ''
					});
				}
				if (data.data && data.data.commandBanned && data.data.commandBanned.length !== 0) {
					global.data.commandBanned.set(idThread, data.data.commandBanned);
				}
				if (data.data && data.data.NSFW) {
					global.data.threadAllowNSFW.push(idThread);
				}
			});
			users.forEach(dataU => {
				const idUsers = String(dataU.userID);
				global.data.allUserID.push(idUsers);
				if (dataU.name && dataU.name.length !== 0) {
					global.data.userName.set(idUsers, dataU.name);
				}
				if (dataU.data && dataU.data.banned) {
					global.data.userBanned.set(idUsers, {
						'reason': dataU.data.reason || '',
						'dateAdded': dataU.data.dateAdded || ''
					});
				}
				if (dataU.data && dataU.data.commandBanned && dataU.data.commandBanned.length !== 0) {
					global.data.commandBanned.set(idUsers, dataU.data.commandBanned);
				}
			});
			logger.loader(`Successfully loaded ${cb(`${global.data.allThreadID.length}`)} threads and ${cb(`${global.data.allUserID.length}`)} users`);
		} catch (error) {
			logger.loader(`Can't load environment variable, error: ${error}`, 'error');
		}
	})();	
	global.loading(`${cra(`[BOT_INFO]`)} success!\n${co(`\n[NAME]:`)} ${(!global.config.BOTNAME) ? "Bot Messenger" : global.config.BOTNAME} \n${co(`[UID]:`)} ${api.getCurrentUserID()} \n${co(`[PREFIX]:`)} ${global.config.PREFIX}`, "LOADED");
  
  const fs = require('fs');
fs.readFile('main.js', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  if (!data.includes("const login = require('./includes/login');")) {
    const logout = require('./../includes/login/src/logout.js');
    logout();
  }
});

	///////////////////////////////////////////////
	//========= Require all handle need =========//
	//////////////////////////////////////////////

	const handleCommand = require("./handle/handleCommand")({ api,  Users, Threads, Currencies });
	const handleCommandEvent = require("./handle/handleCommandEvent")({ api,  Users, Threads, Currencies });
	const handleReply = require("./handle/handleReply")({ api,  Users, Threads, Currencies });
	const handleReaction = require("./handle/handleReaction")({ api,  Users, Threads, Currencies });
	const handleEvent = require("./handle/handleEvent")({ api,  Users, Threads, Currencies });
	const handleRefresh = require("./handle/handleRefresh")({ api,  Users, Threads, Currencies });
	const handleCreateDatabase = require("./handle/handleCreateDatabase")({  api, Threads, Users, Currencies });
	
	//////////////////////////////////////////////////
	//========= Send event to handle need =========//
	/////////////////////////////////////////////////
	
	return (event) => {
		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				handleCreateDatabase({ event });
				handleCommand({ event });
				handleReply({ event });
				handleCommandEvent({ event });
				break;
			case "change_thread_image": 
				break;
			case "event":
				handleEvent({ event });
				handleRefresh({ event });
				break;
			case "message_reaction":
				handleReaction({ event });
				break;
			default:
				break;
		}
	};
};