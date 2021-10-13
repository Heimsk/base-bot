module.exports = class Format {
  constructor(cmd = {}) {
    let n_cmd = {
      name: cmd.help.name,
      description: cmd.help.description,
      default_permission: cmd.help.d_permission || true,
      type: cmd.help.type || 1
    };
    if(cmd.options) {
      n_cmd.options = cmd.options;
    }
    
    return n_cmd;
  }
};