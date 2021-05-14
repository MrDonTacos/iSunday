const ytdl = require('ytdl-core')

module.exports = {
    name: 'play',
    description: 'Incluye al canal de voz a tu amiga Sunday!',
	execute(message, args) { 
	if (!args) 
            return
        if (!ytdl.validateURL(args[0])) 
            return
	},
};
