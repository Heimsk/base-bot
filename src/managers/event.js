const fs = require("fs").promises;

module.exports = class EventManager {
  constructor(client) {
    this.client = client;
  }
  
  async execute() {
    try {
      const { client } = this;
      for(let dir of await fs.readdir("./src/events")) {
        for(let file of await fs.readdir(`./src/events/${dir}`)) {
          const Event = require(`../events/${dir}/${file}`);
          const event = new Event();
          client.on(event.name, await event.exec.bind(null, client));
        }
      }
      client.logger.success(`Eventos carregados!`);
    } catch(_) {
      console.log(_);
    }
  }
}