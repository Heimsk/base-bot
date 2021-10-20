module.exports = class BaseCommand {
  constructor(help, require, options) {
    this.help = help || {};
    this.require = require || {};
    this.options = options || undefined;
  }
  
  async handleError(ctx, mode = 1) {
    try {
      let format = `${this.client.config.emojis.error || ""} » Houve um erro inesperado, tente novamente mais tarde!`;
      if(mode == 1) {
        await ctx.send(format, true);
      } else {
        await ctx.edit(format);
      }
    } catch(_) {
      throw Error(_);
    }
  }
  
  async handleSuccess(ctx, msg, mode = 1) {
    try {
      let format = `${this.client.config.emojis.success || ""} » ${msg}`;
      if(mode == 1) {
        await ctx.send(format);
      } else {
        await ctx.edit(format)
      }
    } catch(_) {
      throw Error(_);
    }
  }
  
  async handleCustomError(ctx, msg, mode = 1, options = {}) {
    try {
      let format = `${options.emoji ? options.emoji : this.client.config.emojis.error || ""} » ${msg}`;
      if(mode == 1) {
        await ctx.send(format, options.ephemeral ? true : false);
      } else {
        await ctx.edit(format);
      }
    } catch(_) {
      throw Error(_);
    }
  }
}