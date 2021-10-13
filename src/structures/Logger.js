const chalk = require("chalk");

module.exports = class Logger {
  error(msg) {
    if(!msg) {
      throw Error(`Mensagem não espicificada`);
    }
    console.log(chalk.red("error") + " " + String(msg));
  }
  
  success(msg) {
    if(!msg) {
      throw Error(`Mensagem não espicificada`);
    }
    console.log(chalk.green("success") + " " + String(msg));
  }
  info(msg) {
    if(!msg) {
      throw Error(`Mensagem não espicificada`);
    }
    console.log(chalk.blue("info") + " " + String(msg));
  }
  warn(msg) {
    if(!msg) {
      throw Error(`Mensagem não espicificada`);
    }
    console.log(chalk.yellow("warn") + " " + String(msg));
  }
}