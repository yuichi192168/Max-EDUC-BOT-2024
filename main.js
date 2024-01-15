const { readdirSync, readFileSync, writeFileSync } = require("fs-extra");
const { join, resolve } = require('path')
const { execSync } = require('child_process');
const config = require("./config.json");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const fs = require("fs");
const login = require('./includes/login');
const moment = require("moment-timezone");
const logger = require("./utils/log.js");
const schedule = require('node-schedule');
global.client = new Object({
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  eventRegistered: new Array(),
  handleSchedule: new Array(),
  handleReaction: new Array(),
  handleReply: new Array(),
  mainPath: process.cwd(),
  configPath: new String(),
  getTime: function(option) {
    switch (option) {
      case "seconds":
        return `${moment.tz("Asia/Manila").format("ss")}`;
      case "minutes":
        return `${moment.tz("Asia/Manila").format("mm")}`;
      case "hours":
        return `${moment.tz("Asia/Manila").format("HH")}`;
      case "date":
        return `${moment.tz("Asia/Manila").format("DD")}`;
      case "month":
        return `${moment.tz("Asia/Manila").format("MM")}`;
      case "year":
        return `${moment.tz("Asia/Manila").format("YYYY")}`;
      case "fullHour":
        return `${moment.tz("Asia/Manila").format("HH:mm:ss")}`;
      case "fullYear":
        return `${moment.tz("Asia/Manila").format("DD/MM/YYYY")}`;
      case "fullTime":
        return `${moment.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY")}`;
    }
  },
  timeStart: Date.now()
});

global.data = new Object({
  threadInfo: new Map(),
  threadData: new Map(),
  userName: new Map(),
  userBanned: new Map(),
  threadBanned: new Map(),
  commandBanned: new Map(),
  threadAllowNSFW: new Array(),
  allUserID: new Array(),
  allCurrenciesID: new Array(),
  allThreadID: new Array()
});

global.utils = require("./utils");
global.loading = require("./utils/log");
global.nodemodule = new Object();
global.config = new Object();
global.configModule = new Object();
global.moduleData = new Array();
global.language = new Object();
global.account = new Object();

// ────────────────── //
const chalk = require("chalk");
const gradient = require("gradient-string");
const theme = config.DESIGN.Theme;
let cra;
let co;
let cb;
let cv;
if (theme.toLowerCase() === 'blue') {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("#243aff", "#4687f0", "#5800d4");
  cb = chalk.blueBright;
  cv = chalk.bold.hex("#3467eb");
  
}else if (theme.toLowerCase() === 'fiery') {
  cra = gradient('orange', 'orange', 'yellow');
  co = gradient("#fc2803", "#fc6f03", "#fcba03");
  cb = chalk.hex("#fff308");
  cv = chalk.bold.hex("#fc3205");
} else if (theme.toLowerCase() === 'red') {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("red", "orange");
  cb = chalk.hex("#ff0000");
  cv = chalk.bold.hex("#ff0000");
} else if (theme.toLowerCase() === 'aqua') {
  cra = gradient("#6883f7", "#8b9ff7", "#b1bffc")
  co = gradient("#0030ff", "#4e6cf2");
  cb = chalk.hex("#3056ff");
  cv = chalk.bold.hex("#0332ff");
} else if (theme.toLowerCase() === 'pink') {
  cra = gradient('purple', 'pink');
  co = gradient("#d94fff", "purple");
  cb = chalk.hex("#6a00e3");
  cv = chalk.bold.hex("#6a00e3");
} else if (theme.toLowerCase() === 'retro') {
  cra = gradient("orange", "purple");
  co = gradient.retro;
  cb = chalk.hex("#ffce63");
  cv = chalk.bold.hex("#3c09ab");
} else if (theme.toLowerCase() === 'sunlight') {
  cra = gradient("#f5bd31", "#f5e131");
  co = gradient("#ffff00", "#ffe600");
  cb = chalk.hex("#faf2ac");
  cv = chalk.bold.hex("#ffe600");
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
}else if (theme.toLowerCase() === 'teen') {
  cra = gradient("#81fcf8", "#853858");
  co = gradient.teen;
  cb = chalk.hex("#a1d5f7");
  cv = chalk.bold.hex("#ad0042");
} else if (theme.toLowerCase() === 'summer') {
  cra = gradient("#fcff4d", "#4de1ff");
  co = gradient.summer;
  cb = chalk.hex("#ffff00");
  cv = chalk.bold.hex("#fff700")
} else if (theme.toLowerCase() === 'flower') {
  cra = gradient("yellow", "yellow", "#81ff6e");
  co = gradient.pastel;
  cb = gradient('#47ff00', "#47ff75");
  cv = chalk.bold.hex("#47ffbc");
} else if (theme.toLowerCase() === 'ghost') {
  cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
  co = gradient.mind;
  cb = chalk.blueBright;
  cv = chalk.bold.hex("#1390f0");
} else if (theme === 'hacker') {
  cra = chalk.hex('#4be813');
  co = gradient('#47a127', '#0eed19', '#27f231');
  cb = chalk.hex("#22f013");
  cv = chalk.bold.hex("#0eed19");
} else {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("#243aff", "#4687f0", "#5800d4");
  cb = chalk.blueBright;
  cv = chalk.bold.hex("#3467eb");
}

// ────────────────── //
const errorMessages = [];
if (errorMessages.length > 0) {
  console.log("Commands with errors:");
  errorMessages.forEach(({ command, error }) => {
    console.log(`${command}: ${error}`);
  });
}
// ────────────────── //
var configValue;
try {
  global.client.configPath = join(global.client.mainPath, "config.json");
  configValue = require(global.client.configPath);
  logger.loader("Found config.json file!");
} catch (e) {
  return logger.loader('"config.json" file not found."', "error");
}

try {
  for (const key in configValue) global.config[key] = configValue[key];
  logger.loader("Config Loaded!");
} catch (e) {
  return logger.loader("Can't load file config!", "error")
}

for (const property in listPackage) {
  try {
    global.nodemodule[property] = require(property)
  } catch (e) { }
}
const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, {
  encoding: 'utf-8'
})).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
  const getSeparator = item.indexOf('=');
  const itemKey = item.slice(0, getSeparator);
  const itemValue = item.slice(getSeparator + 1, item.length);
  const head = itemKey.slice(0, itemKey.indexOf('.'));
  const key = itemKey.replace(head + '.', '');
  const value = itemValue.replace(/\\n/gi, '\n');
  if (typeof global.language[head] == "undefined") global.language[head] = new Object();
  global.language[head][key] = value;
}

global.getText = function(...args) {
  const langText = global.language;
  if (!langText.hasOwnProperty(args[0])) {
    throw new Error(`${__filename} - Not found key language: ${args[0]}`);
  }
  var text = langText[args[0]][args[1]];
  if (typeof text === 'undefined') {
    throw new Error(`${__filename} - Not found key text: ${args[1]}`);
  }
  for (var i = args.length - 1; i > 0; i--) {
    const regEx = RegExp(`%${i}`, 'g');
    text = text.replace(regEx, args[i + 1]);
  }
  return text;
};

try {
  var appStateFile = resolve(join(global.client.mainPath, config.APPSTATEPATH || "appstate.json"));
  var appState = ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && (fs.readFileSync(appStateFile, 'utf8'))[0] != "[" && config.encryptSt) ? JSON.parse(global.utils.decryptState(fs.readFileSync(appStateFile, 'utf8'), (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER))) : require(appStateFile);
  logger.loader("Found the bot's appstate.")
} catch (e) {
  return logger.loader("Can't find the bot's appstate.", "error")
}

function onBot() {
  const loginData = {};
  loginData.appState = appState;
  login(loginData, async (loginError, loginApiData) => {
    if (loginError) {
      if (loginError.error == 'Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.') {
        console.log(loginError.error)
        process.exit(0)
      } else {
        console.log(loginError)
        return process.exit(0)
      }
    }

    const fbstate = loginApiData.getAppState();
    loginApiData.setOptions(global.config.FCAOption);
    let d = loginApiData.getAppState();
    d = JSON.stringify(d, null, '\x09');
    if ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && global.config.encryptSt) {
      d = await global.utils.encryptState(d, process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER);
      writeFileSync(appStateFile, d)
    } else {
      writeFileSync(appStateFile, d)
    }
    global.account.cookie = fbstate.map(i => i = i.key + "=" + i.value).join(";");
    global.client.api = loginApiData
    global.config.version = config.version,
      (async () => {
        const commandsPath = `${global.client.mainPath}/modules/commands`;
        const listCommand = readdirSync(commandsPath).filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
        console.log(cv(`\n` + `──LOADING COMMANDS─●`));
        for (const command of listCommand) {
          try {
            const module = require(`${commandsPath}/${command}`);
            const { config } = module;

            if (!config?.name) {
              try {
                throw new Error(`[COMMAND] ${command} command has no name property or empty!`);
              } catch (error) {
                console.log(chalk.red(error.message));
                continue;
              }
            }
            if (!config?.commandCategory) {
              try {
                throw new Error(`[COMMAND] ${command} commandCategory is empty!`);
              } catch (error) {
                console.log(chalk.red(error.message));
                continue;
              }
            }

            if (!config?.hasOwnProperty('usePrefix')) {
              console.log(`Command`, chalk.hex("#ff0000")(command) + ` does not have the "usePrefix" property.`);
              continue;
            }

            if (global.client.commands.has(config.name || '')) {
              console.log(chalk.red(`[COMMAND] ${chalk.hex("#FFFF00")(command)} Module is already loaded!`));
              continue;
            }
            const { dependencies, envConfig } = config;
            if (dependencies) {
              Object.entries(dependencies).forEach(([reqDependency, dependencyVersion]) => {
                if (listPackage[reqDependency]) return;
                try {
                  execSync(`npm --package-lock false --save install ${reqDependency}${dependencyVersion ? `@${dependencyVersion}` : ''}`, {
                    stdio: 'inherit',
                    env: process.env,
                    shell: true,
                    cwd: join(__dirname, 'node_modules')
                  });
                  require.cache = {};
                } catch (error) {
                  const errorMessage = `[PACKAGE] Failed to install package ${reqDependency} for module`;
                  global.loading.err(chalk.hex('#ff7100')(errorMessage), 'LOADED');
                }
              });
            }

            if (envConfig) {
              const moduleName = config.name;
              global.configModule[moduleName] = global.configModule[moduleName] || {};
              global.config[moduleName] = global.config[moduleName] || {};
              for (const envConfigKey in envConfig) {
                global.configModule[moduleName][envConfigKey] = global.config[moduleName][envConfigKey] ?? envConfig[envConfigKey];
                global.config[moduleName][envConfigKey] = global.config[moduleName][envConfigKey] ?? envConfig[envConfigKey];
              }
              var configPath = require('./config.json');
              configPath[moduleName] = envConfig;
              writeFileSync(global.client.configPath, JSON.stringify(configPath, null, 4), 'utf-8');
            }


            if (module.onLoad) {
              const moduleData = {
                api: loginApiData
              };
              try {
                module.onLoad(moduleData);
              } catch (error) {
                const errorMessage = "Unable to load the onLoad function of the module."
                throw new Error(errorMessage, 'error');
              }
            }

            if (module.handleEvent) global.client.eventRegistered.push(config.name);
            global.client.commands.set(config.name, module);
            try {
              global.loading(`${cra(`LOADED`)} ${cb(config.name)} success`, "COMMAND");
            } catch (err) {
              console.error("An error occurred while loading the command:", err);
            }

            console.err
          } catch (error) {
            global.loading.err(`${chalk.hex('#ff7100')(`LOADED`)} ${chalk.hex("#FFFF00")(command)} fail ` + error, "COMMAND");
          }
        }
      })(),

      (async () => {
        const events = readdirSync(join(global.client.mainPath, 'modules/events')).filter(ev => ev.endsWith('.js') && !global.config.eventDisabled.includes(ev));
        console.log(cv(`\n` + `──LOADING EVENTS─●`));
        for (const ev of events) {
          try {
            const event = require(join(global.client.mainPath, 'modules/events', ev));
            const { config, onLoad, run } = event;
            if (!config || !config.name || !run) {
              global.loading.err(`${chalk.hex('#ff7100')(`LOADED`)} ${chalk.hex("#FFFF00")(ev)} Module is not in the correct format. `, "EVENT");
              continue;
            }


            if (errorMessages.length > 0) {
              console.log("Commands with errors:");
              errorMessages.forEach(({ command, error }) => {
                console.log(`${command}: ${error}`);
              });
            }

            if (global.client.events.has(config.name)) {
              global.loading.err(`${chalk.hex('#ff7100')(`LOADED`)} ${chalk.hex("#FFFF00")(ev)} Module is already loaded!`, "EVENT");
              continue;
            }
            if (config.dependencies) {
              const missingDeps = Object.keys(config.dependencies).filter(dep => !global.nodemodule[dep]);
              if (missingDeps.length) {
                const depsToInstall = missingDeps.map(dep => `${dep}${config.dependencies[dep] ? '@' + config.dependencies[dep] : ''}`).join(' ');
                execSync(`npm install --no-package-lock --no-save ${depsToInstall}`, {
                  stdio: 'inherit',
                  env: process.env,
                  shell: true,
                  cwd: join(__dirname, 'node_modules')
                });
                Object.keys(require.cache).forEach(key => delete require.cache[key]);
              }
            }
            if (config.envConfig) {
              const configModule = global.configModule[config.name] || (global.configModule[config.name] = {});
              const configData = global.config[config.name] || (global.config[config.name] = {});
              for (const evt in config.envConfig) {
                configModule[evt] = configData[evt] = config.envConfig[evt] || '';
              }
              writeFileSync(global.client.configPath, JSON.stringify({
                ...require(global.client.configPath),
                [config.name]: config.envConfig
              }, null, 2));
            }
            if (onLoad) {
              const eventData = {
                api: loginApiData
              };
              await onLoad(eventData);
            }
            global.client.events.set(config.name, event);
            global.loading(`${cra(`LOADED`)} ${cb(config.name)} success`, "EVENT");
          }
          catch (err) {
            global.loading.err(`${chalk.hex("#ff0000")('ERROR!')} ${cb(ev)} failed with error: ${err.message}` + `\n`, "EVENT");
          }
        }
      })();
    console.log(cv(`\n` + `──BOT START─● `));
    global.loading(`${cra(`[SUCCESS]`)} Loaded ${cb(`${global.client.commands.size}`)} commands and ${cb(`${global.client.events.size}`)} events successfully`, "LOADED");
    global.loading(`${cra(`[TIMESTART]`)} Launch time: ${((Date.now() - global.client.timeStart) / 1000).toFixed()}s`, "LOADED");
    const listener = require('./includes/listen')({ api: loginApiData });
    global.custom = require('./custom')({ api: loginApiData });
    global.handleListen = loginApiData.listenMqtt(async (error, message) => {
      if (error) {
        if (error.error === 'Not logged in.') {
          logger("Your bot account has been logged out!", 'LOGIN');
          return process.exit(1);
        }
        if (error.error === 'Not logged in') {
          logger("Your account has been checkpointed, please confirm your account and log in again!", 'CHECKPOINTS');
          return process.exit(0);
        }
        console.log(error);
        return process.exit(0);
      }
      if (['presence', 'typ', 'read_receipt'].some(data => data === message.type)) return;
      return listener(message);
    });
  });
}
(async () => {
  try {
    console.log(cv(`\n` + `──DATABASE─●`));
    global.loading(`${cra(`[CONNECT]`)} Connected to JSON database successfully!`, "DATABASE");
    onBot();
    } catch (error) {
       global.loading.err(`${cra(`[CONNECT]`)} Failed to connect to the JSON database.`, "DATABASE");
      }
})();