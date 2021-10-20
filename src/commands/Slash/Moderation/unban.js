const BaseCommand = require("../../../structures/BaseSlashCommand");

module.exports = class UnbanCmd extends BaseCommand {
  constructor(client) {
    super({
      name: "unban",
      description: "[ 🛡️ Moderação ] Retire o banimento de alguém com esse comando."
    }, {
      clientPerms: ["banMembers"],
      userPerms: ["banMembers"]
    }, [{
      type: 6,
      name: "usuário",
      description: "O usuário que terá o seu banimento retirado",
      required: true
    }]);
    this.client = client;
  }
  
  async exec(ctx) {
    try {
      const userid = ctx.options.find(n => n.name == "usuário").value;
      let user;
      
      try {
        user = await this.client.getRESTUser(userid);
      } catch(_) {
        await this.handleCustomError(ctx, "Usuário não encontrado!", { ephemeral: true, emoji: "❓"});
      }
      
      if(user) {
        let bans = await ctx.guild.getBans();
        let find = bans.find(n => n.user.id == user.id);
        if(!find) {
          return await this.handleCustomError(ctx, "Esse usuário não está banido.", 1, { ephemeral: true });
        }
        try {
          await ctx.guild.unbanMember(userid);
          await this.handleSuccess(ctx, `O banimento de: \`${user.username}\` foi retirado!`, 1);
        } catch(_) {
          await this.handleCustomError(ctx, `Houve um erro inesperado ao retirar o banimento: \`${_}\``, 1, { ephemeral: true });
          console.log(_);
        }
      }
    } catch(_) {
      console.log(_);
      await this.handleError(ctx);
    }
  }
}