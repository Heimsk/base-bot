const BaseCommand = require("../../../structures/BaseSlashCommand");

module.exports = class ClearCmd extends BaseCommand {
  constructor(client) {
    super({
      name: "clear",
      description: "[ 🛡️ Moderação ] Apague mensagens do canal com esse comando."
    }, {
      clientPerms: ["manageMessages"],
      userPerms: ["manageMessages"]
    }, [{
      type: 4,
      required: true,
      name: "quantidade",
      description: "A quantidade de mensagens para apagar"
    }]);
    this.client = client;
  }
  
  async exec(ctx) {
    try {
      ctx.send({}, false, 5);
      const quant = ctx.options.find(n => n.name == "quantidade").value;
      
      if(isNaN(quant)) {
        return await this.handleCustomError(ctx, "Quantidade inválida!", 2);
      }
      
      if(quant < 2 || quant > 1000) {
        return await this.handleCustomError(ctx, "Eu só posso apagar entre 2 a 1000 mensagens!", 2);
      }
      
      try {
        let qnt = await ctx.channel.purge({ limit: Number(quant) }, msg => msg.interaction?.id != ctx.rawINT.id);
        await this.handleSuccess(ctx, `**${qnt}** mensagens foram apagadas nesse canal!`, 2);
      } catch(_) {
        this.client.logger.error(`Erro ao apagar mensagens: \`${_}\``);
        await this.handleCustomError(ctx, `Houve um erro ao apagar mensagens: \`${_}\``, 2);
      }
    } catch(_) {
      console.log(_);
      await this.handleError(ctx);
    }
  }
}