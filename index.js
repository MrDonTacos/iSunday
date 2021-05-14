const fs = require('fs')
const { Readable } = require('stream')
const Discord = require('discord.js');
const {prefix} = require('./config.json')

require('custom-env').env(true)

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
//

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    if(message.content.startsWith(prefix))
    {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;

        const command = client.commands.get(commandName);

        if (command.args && !args.length) {
            let reply = `No se pasado ningún argumento, ${message.author}!`;

            if(command.usage) {
			    reply += `\nEl uso apropiado del comando es: \`${prefix}${command.name} ${command.usage}\``;
		    }
    		return message.channel.send(reply);
        }


        try {
        	command.execute(message, args);
        } catch (error) {
        	console.error(error);
        	message.reply('Hubo un error al ejecutar el comando!');
        }
    }   
});

client.login(process.env.PRIVATE_TOKEN_PRODUCTION);