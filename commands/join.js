const voice = require('../controller/voiceController.js')

module.exports = {
    name: 'join',
    description: 'Incluye al canal de voz a tu amiga Sunday!',
	execute(message, args) { 
		if (!args.length) {
            if (message.member.voice.channel) {
                try{
                    let success = voice.join  (message).then(response =>{
                      return console.log(response)
                    }).catch(error =>{
                      console.error(error)
                    })
                  }catch(error)
                  {
                    console.log(error)
                  }
              }
		} 
	},
};