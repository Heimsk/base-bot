const fs = require('fs').promises;
const Format = require("../structures/Format");

module.exports = class SlashCommandManager {
  constructor(client) {
    this.client = client;
  }
  
  compare(obj1, obj2) {
    if(!obj1 || !obj2) {
      return false;
    }
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    
    if(keys1.length !== keys2.length) {
      return false;
    }
    
    for(let key of keys1) {
      if(typeof obj1[key] == "object" && typeof obj2[key] == "object") {
        if(!this.compare(obj1[key], obj2[key])) {
          return false;
        }
      } else if(obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }
  
  async postCommand(obj) {
    return await this.client.requestHandler.request("POST", this.url, true, obj);
  }
  
  async deleteCommand(id) {
    await this.client.requestHandler.request("DELETE", `${this.url}/${id}`, true);
  }
  
  async execute() {
    try {
      const { client } = this;
      client.logger.info(`Registrando slash commands...`, "SlashCommandManager");
      const URL = this.url = `/applications/${this.client.user.id}/guilds/798973102552907806/commands`;
      let cmds = await client.requestHandler.request("GET", URL, true);
      let new_cmds = [];
      
      for(let dir of await fs.readdir("./src/commands/Slash")) {
        for(let file of await fs.readdir(`./src/commands/Slash/${dir}`)) {
          const Command = require(`../commands/Slash/${dir}/${file}`);
          const cmd = new Command(client);
          if(cmd.help) {
            if(cmd.help.name) {
              let format = new Format(cmd);
              let ar_cmd = cmds.find(c => c.name == format.name);
              
              if(ar_cmd) {
                delete ar_cmd.application_id;
                delete ar_cmd.id;
                delete ar_cmd.version;
                delete ar_cmd.guild_id;
              }
              
              
              if(!this.compare(ar_cmd, format)) {
                try {
                  await this.postCommand(format);
                  new_cmds.push(cmd.help.name);
                } catch(_) {
                  client.logger.error(`Erro ao registrar o comando ${file}: ${_}`);
                }
              }
              client.commands[format.name] = cmd;
            }
          }
        }
      }
      for(let cmd of cmds) {
        if(!client.commands[cmd.name]) {
          await this.deleteCommand(cmd.id);
        }
      }
      
      client.logger.success(`${new_cmds.length} novos slash commands registrados!`, "SlashCommandManager");
    } catch(_) {
      console.log(_);
    }
  }
}