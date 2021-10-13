const { Client } = require('eris');
const EventManager = require('../managers/event');
const CommandManager = require('../managers/command');
const Logger = require("./Logger");

module.exports = class Bot extends Client {
  constructor(token, options) {
    super(token, options);
    this.commands = {};
    this.managers = {};
    this.config = require("../../config");
    this.logger = new Logger();
  }
  
  async loadManagers() {
    try {
      this.logger.info(`Carregando eventos...`)
      this.managers.event = new EventManager(this);
      this.managers.command = new CommandManager(this);
      await this.managers.event.execute();
    } catch(_) {
      console.log(_);
    }
  }
  
  async start() {
    try {
      this.logger.info(`Iniciando...`);
      await this.loadManagers();
      await this.connect();
    } catch(_) {
      throw Error(_);
    }
  }
}