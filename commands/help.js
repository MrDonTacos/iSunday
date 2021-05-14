const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'Hola! Soy Sunday, una IA diseñada para la materia de I.A. de Sistemas Computacionales. \n Lista de todos los comandos o un comando en especifico.',
	usage: '[command name]',
	execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Lista de comandos disponibles: \n');
            data.push(commands.map(command => {
                if(command.usage != undefined)
                    return `${prefix}${command.name} ${command.usage}`
                else
                    return `${prefix}${command.name} ${command.description}`
            }).join('\n')
            )
                data.push(`\nPara obtener mayor información sobre un comando, utilizar \`${prefix}help [command name]\` para obtener una descripción especifica`);

            return message.channel.send(data, { split: true })
            	.catch(error => {
            		console.error(`No se pudo imprimir la lista de comandos en el canal.\n`, error);
            		message.channel.send('Ha surgido un error al consultar la lista de comandos');
            	});       
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
        	return message.reply('No existe el comando señalado');
        }

        data.push(`${command.name}`);

        if (command.aliases) data.push(`Alias ${command.aliases.join(', ')}`);
        if (command.description) data.push(`${command.description}`);
        if (command.usage) data.push(`\nParametros ${prefix}${command.name} ${command.usage}`);

        message.channel.send(data, { split: true });
    }
};