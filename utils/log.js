const chalk = require('chalk');
const gradient = require('gradient-string');
const con = require('./../config.json');
const theme = con.DESIGN.Theme;
let co;
let error;
if (theme.toLowerCase() === 'blue') {
  co = gradient("#243aff", "#4687f0", "#5800d4");
  error = chalk.red.bold;
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
}else if (theme.toLowerCase() === 'fiery') {
  co = gradient("#fc2803", "#fc6f03", "#fcba03");
  error = chalk.red.bold;
} else if (theme.toLowerCase() === 'red') {
  co = gradient("red", "orange");
  error = chalk.red.bold;
} else if (theme.toLowerCase() === 'aqua') {
  co = gradient("#0030ff", "#4e6cf2");
  error = chalk.blueBright;
} else if (theme.toLowerCase() === 'pink') {
  cra = gradient('purple', 'pink');
  co = gradient("#d94fff", "purple");
} else if (theme.toLowerCase() === 'retro') {
  cra = gradient("#d94fff", "purple");
  co = gradient.retro;
} else if (theme.toLowerCase() === 'sunlight') {
  cra = gradient("#f5bd31", "#f5e131");
  co = gradient("orange", "#ffff00", "#ffe600");
} else if (theme.toLowerCase() === 'teen') {
  cra = gradient("#00a9c7", "#853858");
  co = gradient.teen;
} else if (theme.toLowerCase() === 'summer') {
  cra = gradient("#fcff4d", "#4de1ff");
  co = gradient.summer;
} else if (theme.toLowerCase() === 'flower') {
  cra = gradient("blue", "purple", "yellow", "#81ff6e");
  co = gradient.pastel;
} else if (theme.toLowerCase() === 'ghost') {
  cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
  co = gradient.mind;
} else if (theme === 'hacker') {
  cra = chalk.hex('#4be813');
  co = gradient('#47a127', '#0eed19', '#27f231');
} else {
  co = gradient("#243aff", "#4687f0", "#5800d4");
  error = chalk.red.bold;
}

module.exports = (text, type) => {
  switch (type) {
    case 'warn':
      process.stderr.write(error(`\r[ERROR] `) + text + '\n');
      break;
    case 'error':
      console.log(chalk.bold.hex("#ff0000").bold(`[ERROR] `) + text + '\n');
      break;
    case 'load':
      console.log(co(`[NEW USER] `) + text + '\n');
      break;
    default:
      process.stderr.write(co(`\r[ ${String(type).toUpperCase()} ] `) + text + '\n');
      break;
  }
};

module.exports.error = (text, type) => {
  process.stderr.write(chalk.hex("#ff0000")(`\r» ${type} « `) + text + '\n');
};
module.exports.err = (text, type) => {
  process.stderr.write(co(`[ ${type} ] `) + text + '\n');
};
module.exports.warn = (text, type) => {
  process.stderr.write(co(`\r[ ${type} ] `) + text + '\n');
};
module.exports.loader = (data, option) => {
  switch (option) {
    case 'warn':
      process.stderr.write(co(`[SYSTEM]`), data + '\n');
      break;
    case 'error':
      process.stderr.write(chalk.hex("#ff0000")(`\r[SYSTEM] `) + data + '\n');
      break;
    default:
      console.log(co(`[SYSTEM]`), data);
      break;
  }
};