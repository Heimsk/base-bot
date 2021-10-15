module.exports = class BaseCommand {
  constructor(help, require, options) {
    this.help = help || {};
    this.require = require || {};
    this.options = options || undefined;
  }
  
  async handleError(ctx) {
    try {
      await ctx.send(`${this.client.config.emojis.error || ""} » Houve um erro inesperado, tente novamente mais tarde!`, true);
    } catch(_) {
      await ctx.edit(`${this.client.config.emojis.error || ""} » Houve um erro inesperado, tente novamente mais tarde!`);
    }
  }
  
  async handleSuccess(ctx, msg) {
    try {
      await ctx.send(`${this.client.config.emojis.success || ""} » ${msg}`);
    } catch(_) {
      await ctx.edit(`${this.client.config.emojis.success || ""} » ${msg}`);
    }
  }
  
  async handleCustomError(ctx, msg, emoji) {
    try {
      await ctx.send(`${emoji ? emoji : this.client.config.emojis.error || ""} » ${msg}`);
    } catch(_) {
      await ctx.send(`${emoji ? emoji : this.client.config.emojis.error || ""} » ${msg}`);
    }
  }
}