module.exports = {
    name: "reload",
    description: "Recarga los comandos del bot (Solo disponible para desarrolladores)",
    usage: '<key> <command>',
    execute(message, args) {
        require('custom-env').env(true)

        if (!args.length) return message.channel.send(`No 
        se ha cumplido con la estructura del comando, 
        favor de ejecutar .-help para más información!`);
        const commandKey = args[0].toLowerCase();
        const commandName = args[1].toLowerCase();
        const command = message.client.commands.get(commandName);
        if(commandKey != process.env.DEVELOPER_KEY) return message.channel.send('Llave incorrecta')

        if (!command) return message.channel.send(`El comando ${commandName} no existe`);

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`${commandName} recargado con exito`);
        } catch (error) {
            console.error(error);
            message.channel.send(`Se ha presentado un error al recargar \`${command.name}\`:\n\`${error.message}\``);
        }
    }
}