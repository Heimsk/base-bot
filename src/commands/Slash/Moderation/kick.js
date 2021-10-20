const BaseCommand = require("../../../structures/BaseSlashCommand");

module.exports = class KickCmd extends BaseCommand {
  constructor(client) {
    super({
      name: "kick",
      description: "[ 🛡️ Moderação ] Expulse alguém usando esse comando."
    }, {
      clientPerms: ["kickMembers"],
      userPerms: ["kickMembers"]
    }, [{
      type: 6,
      name: "usuário",
      description: "O usuário que será expulso.",
      required: true
    }, {
      type: 3,
      name: "motivo",
      description: "O motivo pelo qual ele será expulso."
    }]);
    this.client = client;
  }
  
  async exec(ctx) {
    try {
      const userid = ctx.options.find(n => n.name == "usuário").value;
      const reason = ctx.options.find(n => n.name == "motivo")?.value;
      
      const member = ctx.guild.members.get(userid);
      if(member) {
        if(member.user.id == ctx.author.id) {
          return await this.handleCustomError(ctx, `Você não pode se auto expulsar!`, 1, { emoji: "😒", ephemeral: true });
        }
        if(member.user.id == this.client.user.id) {
          return await this.handleCustomError(ctx, "Você não pode me expulsar!", 1, { emoji: "😠", epheneral: true });
        }
        if(member.user.id == ctx.guild.ownerID) {
          return await this.handleCustomError(ctx, "Você não pode expulsar ele, ele é o dono daqui!", 1, { emoji: "😨", ephemeral: true });
        }
        
        let roles = [];
        let a_roles = [];
        member.roles.forEach((id) => {
          roles.push(ctx.guild.roles.get(id));
        });
        ctx.member.roles.forEach((id) => {
          a_roles.push(ctx.guild.roles.get(id));
        });
        roles.sort((a, b) => b.position - a.position);
        a_roles.sort((a, b) => b.position - a.position);
        
        if(roles[0]?.position >= a_roles[0]?.position) {
          return this.handleCustomError(ctx, "Você não pode banir ele, o cargo dele está acima ou na mesma posição que o seu cargo!", 1, { emoji: "😨", ephemeral: true })
        }
        
        try {
          await member.kick(reason ? reason : "Não definido.");
          await this.handleSuccess(ctx, `\`${member.user.username}\` foi expulso com sucesso!`);
        } catch(_) {
          this.client.logger.error(`Erro ao expulsar usuário: ${_}`, "SlashCommandManager");
          await this.handleCustomError(ctx, `Houve um erro ao expulsar o usuário: \`${_}\``, 1, { ephemeral: true })
        }
      } else {
        await this.handleCustomError(ctx, "Membro não encontrado.");
      }
    } catch(_) {
      console.log(_);
    }
  }
}