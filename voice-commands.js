const fs = require('fs')
const searchytsr = require('youtube-search');
const ytdl = require('ytdl-core')
const ytsr = require('ytsr')
ytsr.do_warn_deprecate = false


let config = JSON.parse(fs.readFileSync('config.json'))
let servers = new Map()

class Server {
  constructor() {
    this.queue = []
    this.dispatcher = null
    this.search = null
  }
}

class Song {
  constructor(title, link, duration) {
    this.title = title
    this.link = link
    this.duration = duration
  }
}

async function handleVoiceCommands(command, connection, ctx) {
  // Debug
  console.log(command.queryText + ' -> ' + command.action)
  if (!servers.has(ctx.guild.id)) servers.set(ctx.guild.id, new Server())

  async function playQueue(repeat) {
    console.log("Entró al queue");
    let server = servers.get(ctx.guild.id)
    
    if (!server.queue.length) return
    let song = server.queue[0]
    console.log(server)
    //var ytdldebug = ytdl(song.link, {filter: 'audioonly'}, () => {}, true)
    //console.log(ytdldebug)
    server.dispatcher = connection.play(ytdl(song.link))
    ctx.channel.send(`Playing.. **${song.title}**`)
    
    server.dispatcher.on('error', (err) => {
	console.log(err)
    })

    server.dispatcher.on('finish', function () {
      server.queue.shift()

      if (server.queue.length) {
        setTimeout(playQueue, 1500)
      }
    })
  }


  async function addToQueue() {
    let server = servers.get(ctx.guild.id)
    let song
    if (server.search) {
      // When the user makes a search before instructing the bot what to play
      const deny = ['do not', 'don\'t']

      if (deny.some(s => command.queryText.includes(s))) {
        // If the user cancels the search
        ctx.channel.send('Canceling search..')

        server.search = null
        return
      }

      let options
      if (config.language == 'en') {
        options = [
          ['first', 'one','1'],
          ['second', 'two','2'],
          ['third', 'three', '3'],
          ['fourth', 'four', '4'],
          ['fifth', 'five', '5']
        ]
      } else if (config.language == 'pt-BR') {
        options = [
          ['primeira', 'um','1'],
          ['segunda', 'dois','2'],
          ['terceira', 'três', '3'],
          ['quarta', 'quatro', '4'],
          ['quinta', 'cinco', '5']
        ] 
      }

      const index = options.findIndex(arr => arr.some(s => command.queryText.toLowerCase().includes(s)))
      console.log(index)
      if (index >= 0) {
        // If the user gives a valid option
        song = server.search[index]
        server.search = null
      }

    } else {
	console.log(command.queryText)
      // When the user directly instructs the bot what to play
      let search = command.queryText.split(' ').slice(2).join(' ')
	console.log(search)
      song = await searchytsr(search, { maxResults: 1, key: `${process.env.YOUTUBE_V3_API_KEY}` })
	console.log(song)
      song = song.results[0]
    }
    server.queue.push(new Song(song.title, song.link))
    ctx.channel.send(`Queueing.. **${song.title}**`)
  }

  async function makeSearch() {
    let server = servers.get(ctx.guild.id)

    let search = command.queryText.split(' ').slice(2).join(' ')
    let url = await searchytsr(search, { maxResults: 5, key: `${process.env.YOUTUBE_V3_API_KEY}` })

    server.search = url.results
    
    let result = '**SEARCH RESULTS**\n\n'
    for (index in url.results) {
      result += `**${parseInt(index)+1}.** ${url.items[index].title}\n`
    }

    await ctx.channel.send(result)
  }

  let server = servers.get(ctx.guild.id)
  command.queryText = command.queryText.toLowerCase()
  console.log(command)
  // I had to use synonyms for some actions because
  // Dialogflow couldn't understand them clearly
  switch (command.action) {   
    case 'Play':
      if (command.queryText.split(' ').length < 3) {
        console.log("Entró al switch")
	await playQueue()
      } else {
	console.log("Entró al switch else")
        await addToQueue()
        await playQueue()
      }
      break
    
    // Queue
    case 'Include':
      if (command.queryText.split(' ').length < 3) return
      await addToQueue()
      break
    
    case 'Search':
      if (command.queryText.split(' ').length < 3) return
      await makeSearch()
      break

    case 'Stop':
      server.queue = []
      
      if (server.dispatcher) {
        server.dispatcher.destroy()
        ctx.channel.send(command.fulfillmentText)
      }
      break
    
    case 'Pause':
      if (!server.dispatcher.paused) {
        server.dispatcher.pause()
        ctx.channel.send(command.fulfillmentText)
      }
      break
    
    case 'Resume':
      if (server.dispatcher.paused) {
        server.dispatcher.resume()
        ctx.channel.send(command.fulfillmentText)
      }
      break

    case 'Skip':
      if (server.dispatcher) {
        server.dispatcher.end()
        ctx.channel.send(command.fulfillmentText)
      }
      break

    case 'Change':
      if (['language', 'lingua', 'idioma']
        .some(s => command.queryText.includes(s))) {

        if (['portuguese', 'português']
          .some(s => command.queryText.includes(s))) {

            config.language = 'pt-BR'
            ctx.channel.send('Mudei o reconhecimento de voz para Português.')
        } else if (['english', 'inglês']
          .some(s => command.queryText.includes(s))) {

            config.language = 'en'
            ctx.channel.send('I changed the speech recognition to English.')
        }

        let data = JSON.stringify(config)
        fs.writeFileSync('config.json', data)
      }
      break

    default:
      break
  }
}

module.exports = { handleVoiceCommands }
