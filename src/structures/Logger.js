const chalk = require("chalk");

module.exports = class Logger {
  error(msg, label = "") {
    if(!msg) {
      throw Error(`Mensagem não espicificada`);
    }
    console.log(`${label ? `[ ${String(label)} ] ` : ""}${chalk.red("error")} ${String(msg)}`);
  }
  
  success(msg, label = "") {
    if(!msg) {
      throw Error(`Mensagem não espicificada`);
    }
    console.log(`${label ? `[ ${String(label)} ] ` : ""}${chalk.green("success")} ${String(msg)}`);
  }
  info(msg, label = "") {
    if(!msg) {
      throw Error(`Mensagem não espicificada`);
    }
    console.log(`${label ? `[ ${String(label)} ] ` : ""}${chalk.blue("info")} ${String(msg)}`);
  }
  warn(msg, label = "") {
    if(!msg) {
      throw Error(`Mensagem não espicificada`);
    }
    console.log(`${label ? `[ ${String(label)} ] ` : ""}${chalk.yellow("warn")} ${String(msg)}`);
  }
}