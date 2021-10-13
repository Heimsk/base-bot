const BaseEvent = require('../../structures/BaseEvent');

module.exports = class Event extends BaseEvent {
  constructor() {
    super("ready");
  }
  
  async exec(client) {
    client.logger.success(`${client.user.username} ficou online!`);
    client.logger.info(`Registrando comandos...`);
    await client.managers.command.execute();
  }
}