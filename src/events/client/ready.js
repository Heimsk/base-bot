const BaseEvent = require('../../structures/BaseEvent');

module.exports = class Event extends BaseEvent {
  constructor() {
    super("ready");
  }
  
  async exec(client) {
    client.logger.success(`${client.user.username} ficou online!`, "Client");
    if(client.managers.slashCommand != undefined) {
      await client.managers.slashCommand.execute();
    }
  }
}