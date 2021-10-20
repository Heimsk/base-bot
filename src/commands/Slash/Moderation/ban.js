const BaseCommand = require("../../../structures/BaseSlashCommand");

module.exports = class BanCmd extends BaseCommand {
  constructor(client) {
    super({
      name: "ban",
      description: "[ 🛡️ Moderação ] Bana alguém com esse comando."
    }, {
      clientPerms: ["banMembers"],
      userPerms: ["banMembers"]
    }, [{
      type: 6,
      name: "usuário",
      description: "O usuário que será banido",
      required: true
    }, {
      type: 3,
      name: "motivo",
      description: "O motivo pelo qual ele será banido."
    }]);
    this.client = client;
  }
  
  async exec(ctx) {
    try {
      ctx.send({}, false, 5)
      let userid = ctx.options.find(n => n.name == "usuário").value;
      let reason = ctx.options.find(n => n.name == "motivo");
      
      let user = ctx.guild.members.get(userid)?.user || this.client.users.get(userid);
      if(!user) {
        try {
          user = await this.client.getRESTUser(userid);
        } catch(_) {
          await await this.handleCustomError(ctx, "Usuário não encontrado.");
        }
      }
      
      let member = ctx.guild.members.get(userid);
      if(user.id == ctx.author.id) {
        return await this.handleCustomError(ctx, "Você não pode se auto banir!", 2, { emoji: "😒", ephemeral: true })
      }
      if(user.id == this.client.user.id) {
        return await this.handleCustomError(ctx, "Você não pode me banir!", 2, { emoji: "😠", ephemeral: true });
      }
      if(user.id == ctx.guild.ownerID) {
        return await this.handleCustomError(ctx, "Você não pode banir ele, ele é o dono do servidor!", 2, { emoji: "😨", ephemeral: true });
      }
      if(member) {
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
          return await this.handleCustomError(ctx, "Você não pode banir ele, o cargo dele está acima ou na mesma posição que o seu cargo!", 2, { emoji: "😨", ephemeral: true })
        }
      }
      
      try {
        await ctx.guild.banMember(userid, 7, reason ? reason.value : "Motivo não definido.");
        await this.handleSuccess(ctx, `\`${user.username}\` foi banido com sucesso!`, 2);
      } catch(_) {
        this.client.logger.error(`Erro ao banir usuário: ${_}`)
        await this.handleCustomError(ctx, `Houve um erro ao banir o usuário: \`${_}\``, 2, { ephemeral: true })
      }
    } catch(_) {
      console.log(_);
      await this.handleError(ctx);
    }
  }
}