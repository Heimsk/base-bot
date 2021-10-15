const { User, Member, Guild, TextChannel } = require("eris");
const CTX = require("../../structures/CTX");

module.exports = class SlashCmdEvent {
  constructor() {
    this.name = "rawWS";
  }
  
  async exec(client, packet) {
    if(packet.t == "INTERACTION_CREATE") {
      const int = packet.d;
      let cmd = client.commands[int.data.name];
      let guild = client.guilds.get(int.guild_id);
      let d = Date.now();
      if(cmd) {
        const ctx = await new CTX(client, int, cmd);
        if(cmd.require.ownerOnly && !client.config.devs.includes(ctx.author.id)) {
          return ctx.send(`Você não tem permissão para utilizar este comando.`, true);
        }
        
        if(cmd.require.clientPerms) {
          let botMember = ctx.guild.members.get(client.user.id);
          let perms = [];
          for(let perm of cmd.require.clientPerms) {
            if(!botMember.permissions.has(perm)) {
              perms.push(perm);
            }
          }
          if(perms.length > 0) {
            return await ctx.send(`Eu preciso ${perms.length > 1 ? "das permissões" : "da permissão" } ${mperms(perms)} para executar esse comando!`, true);
          }
        }
        if(cmd.require.userPerms) {
          let perms = [];
          for(let perm of cmd.require.userPerms) {
            if(!ctx.member.permissions.has(perm)) {
              perms.push(perm);
            }
          }
          if(perms.length > 0) {
            return await ctx.send(`Você precisa ${perms.length > 1 ? "das permissões" : "da permissão" } ${mperms(perms)} para executar esse comando!`, true);
          }
        }
        
        try {
          await cmd.exec(ctx);
        } catch(_) {
          try { 
            await ctx.send({
              content: `Houve um erro inesperado, tente novamente mais tarde.`,
              flags: 1 << 6
            });
          } catch(e) {
            console.log();
            ctx.edit(`Houve um erro inesperado, tente novamente mais tarde.`).catch(() => {});
          }
          client.logger.error(`Erro detectado no comando ${cmd.help.name}: ${_}`, "SlashCommandManager");
        }
      }
    }
  }
};

function mperms(perms) {
  return perms.length > 1 ? `${perms.slice(0, -1).map(a => `\`${a}\``).join(', ')} e \`${perms.slice(-1)[0]}\`` : `\`${perms[0]}\``;
}