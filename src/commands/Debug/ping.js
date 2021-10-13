const BaseCommand = require("../../structures/BaseCommand");

module.exports = class PingCmd extends BaseCommand {
  constructor(client) {
    super({
      name: "ping",
      description: "[ 🛠️ Debug ] => Veja a latência do bot com esse comando."
    });
    this.client = client;
  }
  
  async exec(ctx) {
    try {
      ctx.send(`**${this.client.shards.random().latency}**ms`);
    } catch(_) {
      console.log(_);
      await this.handleError(ctx);
    }
  }
}