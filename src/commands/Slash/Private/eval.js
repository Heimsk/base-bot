const { inspect } = require('util');
const baseCommand = require("../../../structures/BaseSlashCommand");
const { exec } = require("child_process");

module.exports = class EvalCmd extends baseCommand {
	constructor(client) {
	  super(
	    { 
	      name: "eval",
	      description: "[ 🔒 Privado ] Somente desenvolvedores podem usar."
	    },
	    {
	      ownerOnly: true
	    },
	    [
	      {
	        name: "code",
	        type: 3,
	        description: "O código que será executado.",
	        required: true
	      },
	      {
	        name: "hidden",
	        type: 3,
	        description: "Escolha se a resposta do eval deve ser privada para você.",
	        choices: [
	          {
	            name: "Sim",
	            value: "true"
	          },
	          {
	            name: "Não",
	            value: "false"
	          }
	        ]
	      },
	      {
	        name: "prompt",
	        type: 3,
	        description: "Escolha se o eval será executado como um comando no terminal.",
	        choices: [
	          {
	            name: "Sim",
	            value: "true"
	          },
	          {
	            name: "Não",
	            value: "false"
	          }
	        ]
	      }
	    ]
	  );
	  this.client = client;
	}
	
	async exec(ctx) {
	  let hidden = ctx.options.find(n => n.name == "hidden") || {};
	  let prompt = ctx.options.find(n => n.name == "prompt") || {};
	  let code = ctx.options.find(n => n.name == "code");
	  try {
	    if(prompt.value == "true") {
	      await ctx.send({}, false, 5);
        exec(code.value, async (error, data, stderr) => {
          if(error) {
            return await ctx.edit(`\`\`\`js\n${clean(error)}\`\`\``);
          } else if(stderr) {
            return await ctx.edit(`\`\`\`js\n${clean(stderr)}\`\`\``);
          } else {
            return await ctx.edit(`\`\`\`js\n${clean(data)}\`\`\``);
          }
        });
	    } else {
	      const evaled = await eval(code.value.replace(/(^`{3}(\w+)?|`{3}$)/g, ''));
  		  const cleanEvaled = clean(inspect(evaled, { depth: 0 }));
  		  await ctx.send({ 
  		    content: `\`\`\`js\n${cleanEvaled}\`\`\``,
  		    flags: hidden.value == "true" ? 1 << 6 : 0
  		  });
	    }
	  } catch (err) {
	    await ctx.send({ 
		    content: `\`\`\`js\n${clean(err)}\`\`\``,
		    flags: hidden.value == "true" ? 1 << 6 : 0
		  });
	  }
	}
};


function clean(text) {
  const blankSpace = String.fromCharCode(8203);
	return typeof text === 'string' ? text.replace(/`/g, '`' + blankSpace).replace(/@/g, '@' + blankSpace) : text;
}
