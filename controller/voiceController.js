const { Readable } = require('stream')
const ytdl = require('ytdl-core')

const { processAudio } = require('../audio-processing-setup')
const { handleVoiceCommands } = require('../voice-commands')

module.exports.join = async (message) => {
// Noiseless stream of audio to send when the bot joins a voice channel
    class Silence extends Readable {
        _read() {
        this.push(Buffer.from([0xF8, 0xFF, 0xFE]))
        }
    }
//	console.log(message)
    const connection = await message.member.voice.channel.join()
        
    connection.play(new Silence(), { type: 'opus' })
    message.channel.send('Hola, estoy lista para ayudarte! Siempre estoy a la alerta de bumblebee!')

    connection.on('speaking', async (user, speaking) => {
      if (speaking.has('SPEAKING')) {
        let audioStream = connection.receiver.createStream(user, { mode: 'pcm' })
	let result = await processAudio(audioStream)
	console.log(result)
        if (result) handleVoiceCommands(result, connection, message)
      }
    })
}
