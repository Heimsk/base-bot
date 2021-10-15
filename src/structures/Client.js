const { Client } = require('eris');
const EventManager = require('../managers/event');
const Logger = require("./Logger");

module.exports = class Bot extends Client {
  constructor(token, options = {}) {
    super(token, options);
    this.commands = {};
    this.managers = {};
    this.allowSlashCommands = Boolean(options.slashCommands) || false;
    this.allowNormalCommands = Boolean(options.normalCommands) || false;
    this.config = require("../../config");
    this.logger = new Logger();
  }
  
  async loadManagers() {
    try {
      this.logger.info(`Carregando eventos...`, "EventManager")
      this.managers.event = new EventManager(this);
      if(this.allowSlashCommands) {
        const SlashCommandManager = require('../managers/slash-command');
        this.managers.slashCommand = new SlashCommandManager(this);
      }
      if(this.allowNormalCommands) {
        const NormalCommandManager = require('../managers/normal-command');
        this.managers.normalCommand = new NormalCommandManager(this);
        await this.managers.normalCommand.execute();
      }
      await this.managers.event.execute();
      
    } catch(_) {
      console.log(_);
    }
  }
  
  async start() {
    try {
      this.logger.info(`Iniciando managers...`, "Client");
      await this.loadManagers();
      await this.connect();
    } catch(_) {
      throw Error(_);
    }
  }
}