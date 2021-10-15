const { User, Member } = require("eris");

module.exports = class CTX {
  #client;
  #int;
  #d;
  #cmd;
  
  constructor(client, int, cmd) {
    return (async () => {
      this.#client = client;
      this.#int = int;
      this.#cmd = cmd;
      this.#d = Date.now();
      
      const guild = this.#client.guilds.get(int.guild_id);
      
      this.guild = guild;
      this.rawINT = this.#int;
      this.channel = await this.#client.getRESTChannel(this.#int.channel_id);
      this.author = new User(this.#int.member.user, this.#client);
      this.member = new Member(this.#int.member, guild, this.#client);
      this.options = this.#int.data.options
      
      return this;
    })();
  }
  
  async send(data = {}, ephemeral = false, type = 4) {
    let format = {
      type: type,
      data: {
        content: data.content,
        ephemeral: ephemeral ? 1 << 6 : null
      }
    };
    if(typeof data != "object") {
      format.data = {
        content: data,
        flags: ephemeral ? 1 << 6 : null
      };
    }
    try {
      await this.#client.requestHandler.request("POST", `/interactions/${this.#int.id}/${this.#int.token}/callback`, true, format);
      if(Math.floor(((Date.now() - this.#d) % 60000) / 1000) > 2) {
        this.#client.logger.warn(`${this.#client.user.username} demorou ${Math.floor(((Date.now() - this.#d) % 60000) / 1000)} segundos para responder o comando ${this.#cmd.help.name}, possível lag. ${this.guild.shard.latency}ms`, "SlashCommandManager");
      }
    } catch(_) {
      await this.#client.logger.error(`Erro ao responder interação(slash-command): ${_}`, "SlashCommandManager");
      throw Error(_);
    }
  }
  
  async edit(data) {
    try {
      let format = data;
      if(typeof data != "object") {
        format = {
          content: data
        };
      }
      return await this.#client.requestHandler.request("PATCH", `/webhooks/${this.#client.user.id}/${this.#int.token}/messages/@original`, true, format);
    } catch(_) {
      throw Error(_);
    }
  }
}