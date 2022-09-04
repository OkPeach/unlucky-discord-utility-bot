//token time
require('dotenv').config();
const TOKEN = process.env.TOKEN;

//prefix
const PREFIX = process.env.PREFIX;

//admin role and moderator role
const ADMIN = process.env.ADMINID;
const ADMIN2 = process.env.ADMIN2ID;
const ADMIN3 = process.env.ADMIN3ID;
const MOD = process.env.MODERATORID;
const HELPER = process.env.HELPERID;


//embed color
emColor = '#' + process.env.EMBEDCOLOR;

//get api keys
catapi = process.env.CATAPIKEY;
conkeys = process.env.CONKEY;
giphyKey = process.env.GKEY;

//random stat
const CommandsNumber = '33';

//import discord
const Discord = require('discord.js');
const { generateDependencyReport, createAudioResource } = require('@discordjs/voice');
const voiceDiscord = require('@discordjs/voice');

const Twitter = require('twit');

var pinger = require("minecraft-pinger")

const Jimp = require("jimp");

//import yt
const ytdl = require('ytdl-core');

//import request
const request = require('request');
const { stat, fs } = require('fs');
const { channel } = require('diagnostics_channel');
const { disconnect } = require('process');

//import jsons
let soundsJSON = require('./sounds.json');

//define client
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', "DIRECT_MESSAGES", 'GUILD_VOICE_STATES'], partials: ["CHANNEL", 'MESSAGE', 'REACTION'] });

//array
const nameArray = [
    'with your mom',
    'type $help',
    `${CommandsNumber} Commands`,
    'now with music!'
];

const typeArray = [
    'PLAYING',
    'PLAYING',
    'LISTENING',
    'PLAYING'
];

const statusArray = [
    'dnd',
    'online',
    'online',
    'online'
];


//twitter shit
const twitterConf = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

const twitterClient = new Twitter(twitterConf);

//channel name
const dest = process.env.TWITTER_CHANNEL; 

//random number   
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//login
client.login(TOKEN).then(() => {
    //index number of array
    let index = 0;
    //10s interval that changes RPC
    setInterval(() => {
        if (index === nameArray.length) index = 0;
        const names = nameArray[index];
        const statuses = statusArray[index];
        const types = typeArray[index];
        client.user.setPresence({ activities: [{ name: names, type: types }], status: statuses });
        index++;
    }, 10000)
});

twitterSwitch = process.env.TWITTERSWITCH;
eloSwitch = process.env.ELOSWITCH;

//on login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)

    if (twitterSwitch === 'true') {
    //stream twitter news
    const stream = twitterClient.stream('statuses/filter', {
        follow: [ `${process.env.TWITTER_ACCOUNT}`, `${process.env.TWITTER_ACCOUNT2}`, `${process.env.TWITTER_ACCOUNT3}`, `${process.env.TWITTER_ACCOUNT4}` , `${process.env.TWITTER_ACCOUNT5}`].join(',')
    });
    
    //didn't find a easier way
    stream.on('tweet', tweet => {
            if (tweet.user.id == process.env.TWITTER_ACCOUNT || tweet.user.id == process.env.TWITTER_ACCOUNT2 || tweet.user.id == process.env.TWITTER_ACCOUNT3 || tweet.user.id == process.env.TWITTER_ACCOUNT4 || tweet.user.id == process.env.TWITTER_ACCOUNT5) {
            //tweet media
            let media = tweet.entities.media

            //tweet embed
            const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                    color = tweet.user.profile_link_color
                );

                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                });
                embedMessage.setTimestamp(new Date().getTime());
    
                embedMessage.addField(`Link:`, `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                embedMessage.addField(`Tweet:`, tweet.text)
    
                embedMessage.addField('Followers:', `${tweet.user.followers_count} Followers`, true)
                embedMessage.addField('Vertified?', `${tweet.user.verified}`, true)
                embedMessage.addField('Tweets:', `${tweet.user.statuses_count} Tweets`, true)
    
                embedMessage.setThumbnail(
                    tweet.user.profile_image_url
                )
    
                embedMessage.setAuthor({
                    name: `${tweet.user.name} (@${tweet.user.screen_name}) Just tweeted:`
                })
    
                if (!!media) for (var j = 0; j < media.length; j++) embedMessage.setImage(media[j].media_url);
    
                client.channels.cache.get(dest).send({
                    embeds: [embedMessage]
                });
            
            //const twitterMessage = `${tweet.user.name} (@${tweet.user.screen_name}) tweeted this: https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
            //client.channels.cache.get(dest).send(twitterMessage)
            return false;
            }
    });
    }
    else 
    {
        console.log('Twitter is disabled')
    }
    if (eloSwitch === 'false')
    {
        console.log('Elo clown is disabled')
    }
    else {
        console.log('Elo clown is enabled')
    }
})

//time
const d = new Date();
const h = d.getHours();
const m = d.getMinutes();
const s = d.getSeconds();
const day = d.getDate();
const month = d.getMonth();
const year = d.getFullYear();

const today = day + ". " + month + ". " + year + " at " + h + ":" + m + ":" + s;

//on new server join
client.on('guildCreate', guild => {
    console.log('I just joined ' + guild.name + 'Pog')

    guild.systemChannel.send(`Thanks for inviting me, Poggers`)

    client.users.fetch('353871885722845188', false).then((user) => {
        //embed time
        const embedMessage =  new Discord.MessageEmbed()
            embedMessage.setColor(
                emColor
            );
            embedMessage.setFooter({
                text: `Unlucky bot | Made by unlucky#8888`
            });
            embedMessage.setTimestamp(new Date().getTime());
            embedMessage.setTitle('Joined ' + guild.name);

            embedMessage.addFields(
                {name: 'Members', value: `${guild.memberCount} members`, inline: true},
                {name: 'Created at', value: `${guild.createdAt}`, inline: true}
            )

            embedMessage.setImage(guild.iconURL);

            user.send({
                embeds: [embedMessage]
            });
    });
})

const devServer = process.env.DEVSERVERID;
const plebRole = process.env.PLEBID;

//welcome new members
client.on('guildMemberAdd', guildMember => {
    guildMember.guild.systemChannel.send(`**Welcome to the ${guildMember.guild.name}, <@${guildMember.user.id}>!**`);

    if (guildMember.guild.id === devServer) {
        var plebrole = guildMember.guild.roles.cache.find(role => role.id === plebRole);
        guildMember.roles.add(plebrole);
    }
});

//listen for messages
client.on('messageCreate', async message => {
    //myš a krysa
    if (message.content.toLowerCase().includes('myš') || message.content.toLowerCase().includes('myši') || message.content.toLowerCase().includes('krysa') || message.content.toLowerCase().includes('krysy')) {
        message.react('🐀');
    }

    if (message.author.id === '329305299997556738' && eloSwitch === 'true') {
        message.react('🤡');
    }

    if ((message.guild === null) === true) {console.log('[DM] ' + message.author.username + '#' + message.author.discriminator + "> " + message.content);};

    //ignore non-prefix messages
    if (!message.content.startsWith(PREFIX)) return;

    //parse message
    const args = message.content.slice(PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();

    //f other bots
    if(message.author.bot) {
        return;
    }

    //help command
    if (command === 'help' || command === 'commands') {
        //embeds
        const embedMessage =  new Discord.MessageEmbed()
        embedMessage.setColor(
            emColor
        )
        embedMessage.setFooter({
            text: `Unlucky bot | Made by unlucky#8888`
        })
        embedMessage.setTimestamp(new Date().getTime());

        embedMessage.setTitle(
            'Command list'
        );
        embedMessage.setDescription(
            'List of commands of the bot'
        );
        embedMessage.setThumbnail(
            client.user.displayAvatarURL({dynamic : true})
        )
        embedMessage.addFields(
            //clean menu
            {name: '🎉 FUN', value: '`' + `${PREFIX}avatar` + '`, ' + '`' + `${PREFIX}8ball` + '`, ' + '`' + `${PREFIX}hug [user]` + '`, ' + '`' + `${PREFIX}birbfact` + '`, ' + '`' + `${PREFIX}meme` + '`'},
            {name: '🖼 Images', value: '`' + `${PREFIX}cat` + '`, ' + '`' + `${PREFIX}dog` + '`, ' + '`' + `${PREFIX}fox` + '`, ' + '`' + `${PREFIX}birb` + '`, ' +  '`' + `${PREFIX}pika` + '`, ' + '`' + `${PREFIX}neko` + '`, ' + '`' + `${PREFIX}newavatar` + '`'},
            {name: '💰 Economy', value: '`' + `${PREFIX}rmb` + '`, ' + '`' + `${PREFIX}eur` + '`' + ', ' +  '`' + `${PREFIX}wallet [btc wallet]` + '`' + ', ' + '`' + `${PREFIX}bitcoin` + '`' },
            {name: '🎧 Audio', value: '`' + `${PREFIX}soundboard [ID]` + '`, ' + '`' + `${PREFIX}soundlist` + '`, ' + '`' + `${PREFIX}play [URL]` + '`, ' + '`' + `${PREFIX}disconnect` + '`, ' +  '`' + `${PREFIX}bye` + '`' },
            {name: 'ℹ INFO', value: '`' + `${PREFIX}ping` + '`, ' + '`' + `${PREFIX}uptime` + '`' + ', ' + '`' + `${PREFIX}serverinfo` + '`' + ', ' + '`' + `${PREFIX}servers` + '`, ' + '`' + `${PREFIX}reverse [image link]` + '`, ' + '`' + `${PREFIX}help` + '`' },
            {name: '⚒ ADMINISTRATION', value: '`' + `${PREFIX}purge [number]` + '`, ' + '`' + `${PREFIX}kick [user] [reason]` + '`, ' + '`' + `${PREFIX}message [ID or @tag] [message]` + '`'},
            {name: '🔞 NSFW', value: '`' + `${PREFIX}boobs` + '`, ' + '`' + `${PREFIX}butts` + '`, ' + '`' + `${PREFIX}lewd` + '`'}

        );

        message.react('✅');

        message.channel.send({
            embeds: [embedMessage]
        });
    }

    //message command
    if (command === 'message' || command === 'msg' || command === 'm') {

    if ((message.guild === null) === false){

        //check if admin
        if (!message.member.roles.cache.some(role => role.id === ADMIN || ADMIN2|| ADMIN3) && !message.member.roles.cache.some(role => role.id === HELPER) && !message.member.roles.cache.some(role => role.id === MOD)) {
            message.react('❌');
            message.reply('Not high enough role');
            return
        }
            else {
                //anyone can use this in DM's 
                //get id and message you want to send
                let id = args.slice(0).join(' ');
                let msg = args.slice(1).join(' ');

                //make the id numbers only
                id = id.replace(/\D/g,'');

                //have fun:)
                client.users.fetch(id, false).then((user) => {
                user.send(msg);
                });
            }
        }
    else {
        //anyone can use this in DM's 
        //get id and message you want to send
        let id = args.slice(0).join(' ');
        let msg = args.slice(1).join(' ');

        //make the id numbers only
        id = id.replace(/\D/g,'');

        //have fun:)
        client.users.fetch(id, false).then((user) => {
            user.send(msg);
        });
    }
    }

    //uptime command
    if (command === 'uptime' || command === 'up') {
        //embeds
        const embedMessage =  new Discord.MessageEmbed()
        embedMessage.setColor(
            emColor
        )
        embedMessage.setFooter({
            text: `Unlucky bot | By unlucky#8888`
        })
        embedMessage.setTimestamp(new Date().getTime());

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        embedMessage.addField('UPTIME', uptime)

        message.react('✅');

        message.channel.send({
            embeds: [embedMessage]
        });
    }

    if (command === 'serverinfo' || command === 'si') {
        const guild = message.guild;

        //guild.invites.fetch()
        //   .then(console.log)
        //   .catch(console.error);

        const user = await client.users.fetch(guild.ownerId, { cache: true });
        const userTag = `${user.username}#${user.discriminator}`;

        message.guild.roles.fetch()
            .then(roles =>{

        const embedMessage =  new Discord.MessageEmbed()
            embedMessage.setColor(
                emColor
            );
            embedMessage.setFooter({
                text: `Unlucky bot | Made by unlucky#8888`
            });
            embedMessage.setTimestamp(new Date().getTime());
            embedMessage.setTitle(guild.name);

            embedMessage.addFields(
                {name: 'Members', value: `${guild.memberCount} members`},
                {name: 'Created at', value: `${guild.createdAt}`},
                {name: 'Joined at', value: `${guild.joinedAt}`},
                {name: 'Owner', value: `${userTag}`},
                {name: 'Highest role', value: `${guild.roles.highest}`},
                {name: 'Roles', value: `There are ${roles.size} roles`},
                {name: 'System channel', value: `${guild.systemChannel}`}
            )

            embedMessage.setAuthor({
                name: 'About'
            })

            embedMessage.setThumbnail(
                guild.iconURL({dynamic : true})
            )

            message.react('✅');

            message.channel.send({
                embeds: [embedMessage]
            });}
        )
    }

    //ping command
    if (command === 'ping') {
        //embeds
        const embedMessage =  new Discord.MessageEmbed()
        embedMessage.setColor(
            emColor
        )
        embedMessage.setFooter({
            text: `Unlucky bot | Made by unlucky#8888`
        })
        embedMessage.setTimestamp(new Date().getTime());

        message.react('✅');
        const m = await message.reply("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
    }

    //get info about wallet from blockchain.info API and send it in embed message
    if (command === 'wallet') {
        //embeds
        const embedMessage =  new Discord.MessageEmbed()
        embedMessage.setColor(
            emColor
        )
        embedMessage.setFooter({
            text: `Unlucky bot | Made by unlucky#8888`
        })
        embedMessage.setTimestamp(new Date().getTime());

        //get wallet address from args
        let wallet = args.slice(0).join(' ');

        //get info about wallet from blockchain.info API
        const url = `https://blockchain.info/q/addressbalance/${wallet}?format=json`;

        request(url, (error, response, body) => {


        const data = JSON.parse(body);

        btc = data * Math.pow(10, -8);

        //get current bitcoin price
        const url2 = `https://api.coindesk.com/v1/bpi/currentprice/BTC.json`;

        request(url2, (error, response, body) => {

            const data2 = JSON.parse(body);

            btcPrice = data2.bpi.USD.rate_float;

            btcinusd = (btc * btcPrice).toFixed(2);

            btcformatted = btcinusd.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        embedMessage.setAuthor({
            name: "(AI Generated command)",
            iconURL: 'https://cdn.pixabay.com/photo/2013/12/08/12/12/bitcoin-225079_960_720.png'
        })
        
        embedMessage.setTitle('BTC wallet balance');

        embedMessage.addField(wallet, '`' +  `Balance: ${btc} btc | ${btcformatted} usd` + '`', false);

        message.react('✅');
        message.channel.send({
            embeds: [embedMessage]
        });
        });
     });
    }

    //send hug gif to user tagged in message
    if (command === 'hug') {
        //embeds
        const embedMessage =  new Discord.MessageEmbed()
        embedMessage.setColor(
            emColor
        )
        embedMessage.setFooter({
            text: `Unlucky bot | Made by unlucky#8888`
        })
        embedMessage.setTimestamp(new Date().getTime());

        //get user id from args
        let id = args.slice(0).join(' ');

        //make sure user is tagged
        if (!id) {
            embedMessage.setTitle('Hug');
            embedMessage.setDescription('You need to tag someone to hug them!');
            message.channel.send({
                embeds: [embedMessage]
            });
        } else {

        //make id only the id number
        id = id.replace(/[^0-9]/g, '');

        //get user from id
        const user = await client.users.fetch(id, { cache: true });

        //get user tag
        const userTag = `${user.username}#${user.discriminator}`;


        //get random hug gif
        const url = `https://api.giphy.com/v1/gifs/random?api_key=${giphyKey}&tag=hug&rating=g`;

        request(url, (error, response, body) => {

            const data = JSON.parse(body);

            embedMessage.setTitle('Hug (AI generated command)');

            embedMessage.setDescription(`${userTag} has been hugged!`);

            embedMessage.setImage(data.data.images.original.url);

            message.react('✅');
            message.channel.send({
                embeds: [embedMessage]
            });
        }
        );
        }
    }

    //purge command
    if (command === "purge") {
        //check if admin
        if (!message.member.roles.cache.some(role => role.id === ADMIN  || ADMIN2|| ADMIN3) && !message.member.roles.cache.some(role => role.id === HELPER) && !message.member.roles.cache.some(role => role.id === MOD)) {
            message.react('❌');
            message.reply('Not high enough role');
            return
        }
        //if user is admin, proceed with deleting
        let amount = args.slice(0).join(' ');
        if (isNaN(amount)) return message.channel.send(amount + ' is not a number!');
        if (amount <= 0) amount = 10;
        if (amount >= 1)
        try {
        message.react('✅');
        const channel = message.channel;

        if (message) {
            await message.delete();
        }

        const { size } = await channel.bulkDelete(amount, true)
        client.user.setPresence({ activities: [{ name: `Purged ${size} messages!`, type: 'PLAYING' }], status: 'online' });

        }
        catch (error) {
            console.log(error);
        }
    }

        //kick command
        if (command === "kick") {
            //check if admin
            if (!message.member.roles.cache.some(role => role.id === ADMIN  || ADMIN2|| ADMIN3) && !message.member.roles.cache.some(role => role.id === HELPER) && !message.member.roles.cache.some(role => role.id === ADMIN)) {
                message.react('❌');
                message.reply('Not high enough role');
                return
            }
            let kickeduser = args.slice(0).join(' ');
            let reason = args.slice(1).join(' ');

            //if user is admin, proceed with kicking
            let kicked = message.mentions.members.first();

            if (!kicked) return message.react('❌'), message.reply('Something went wrong!');

            message.react('✅');

            const user = await client.users.fetch(kicked, { cache: true });
            const userTag = `${user.username}#${user.discriminator}`;

            message.reply('Kicked ' + userTag + ' Reason: ' + reason)
            kicked.kick(); 
        }

    if (command === 'soundboard' || command === 'sb')
    {
        message.react('✅');
   
        //index for sounds and splitting message
        let index = args.slice(0).join(' ');

        if (isNaN(index)) return message.channel.send(index + ' is not a soundboard index number!');
        //console.log(soundArray[index])

        //define channel to connect to
        const channel = message.member.voice.channel;
        if(!channel) return message.channel.send('Not in a voice channel :peepoShrug:');

        //create player and resource to play from
        const player = voiceDiscord.createAudioPlayer();
		const resource = voiceDiscord.createAudioResource(soundsJSON[index].link);

        //connect
		const connection = voiceDiscord.joinVoiceChannel({
			channelId: channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});

        //create report
        //console.log(generateDependencyReport());

        //play
		player.play(resource);
		connection.subscribe(player);

        //disconnect on voice stop
        player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
            //connection.destroy(); 
            //message.channel.send('Disconnected due to inactivity. See you next time')
        });
    }

    if (command === 'play' || command === 'p')
    {
        message.react('✅');
        //get song url
        let song = args.slice(0).join(' ');

        try {
        //define channel to connect to
        const channel = message.member.voice.channel;
        if(!channel) return message.channel.send('Not in a voice channel :peepoShrug:');

        //create player and resource to play from
        const player = voiceDiscord.createAudioPlayer();
		const resource = ytdl(song, { filter: 'audioonly' });

        //connect
		const connection = voiceDiscord.joinVoiceChannel({
			channelId: channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});

        //create report
        //console.log(generateDependencyReport());

        //play
		player.play(createAudioResource(resource, {seek: 0, volume: 1}));
		connection.subscribe(player);

        //disconnect on voice stop
        player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
			connection.destroy();
		});
        }
        catch(err){
            console.log(err);
        }
    }

    if (command === 'disconnect' || command === 'dc')
    {
        message.react('✅');
        //define channel to connect to
        const channel = message.member.voice.channel;
        if(!channel) return message.channel.send('Not in a voice channel :peepoShrug:');

        //create player and resource to play from
        const player = voiceDiscord.createAudioPlayer();
		const resource = voiceDiscord.createAudioResource('');

        //connect
		const connection = voiceDiscord.joinVoiceChannel({
			channelId: channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});

        //create report
        //console.log(generateDependencyReport());

        //play
		player.play(resource);
		connection.subscribe(player);
        connection.destroy();

        message.channel.send('Disconnected!');

    }

    if (command === 'goodbye' || command === 'bye')
    {
        message.react('✅');
        //define channel to connect to
        const channel = message.member.voice.channel;
        if(!channel) return message.channel.send('Not in a voice channel :peepoShrug:');

        //create player and resource to play from
        const player = voiceDiscord.createAudioPlayer();
		const resource = voiceDiscord.createAudioResource('https://cdn.discordapp.com/attachments/940555830275747880/946357130536058910/change-da-world-my-final-message-goodbye.mp3');

        //connect
		const connection = voiceDiscord.joinVoiceChannel({
			channelId: channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});

        //create report
        //console.log(generateDependencyReport());

        //play
		player.play(resource);
		connection.subscribe(player);

        //disconnect on voice stop
        player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
			connection.destroy();
		});
    }

    if (command === 'soundlist' || command === 'sl')
    {
        //page
        let page = args.slice(0).join(' ');

        if (isNaN(page)) return message.channel.send(page + ' is not a number!');

        //lenght
        var count = Object.keys(soundsJSON).length;

        //embeds
        const embedMessage =  new Discord.MessageEmbed()
        embedMessage.setColor(
            emColor
        )
        embedMessage.setFooter({
            text: `Unlucky bot | Made by unlucky#8888`
        })
        embedMessage.setTimestamp(new Date().getTime());

        embedMessage.setTitle(
            `List of sounds I can play with ${PREFIX}soundboard [ID]`
        );
        embedMessage.setDescription(
            `Usage: ${PREFIX}soundboard [ID] | used ${count}/25 fields`
        );
        embedMessage.setThumbnail(
            client.user.displayAvatarURL({dynamic : true})
        )

        var count = Object.keys(soundsJSON).length;
        //console.log(count);

        //lists all sound in the json
        for (var sound of soundsJSON) 
        {
            embedMessage.addField('ID: ' + sound.id, sound.name, true)
        }

        message.react('✅');

        message.channel.send({
            embeds: [embedMessage]
        })/* .then(sentMessage => {
            sentMessage.react('🔼').then(() => sentMessage.react('🔽'));
        }) */
    }

    if (command === '8ball'){
        message.react('✅');

        let question = args.slice(0).join(' ');

        responses = [
            'That is a resounding no',
            'It is not looking likely',
            'Too hard to tell',
            'It is quite possible',
            'That is a definite yes!',
            'Maybe',
            'There is a good chance'
        ];

        let index = getRandomInt(7);

        const response = responses[index];

        const embedMessage =  new Discord.MessageEmbed()
            embedMessage.setColor(
                emColor
            );
            embedMessage.setFooter({
                text: `Unlucky bot | Made by unlucky#8888 | r = ` + index
            });
            embedMessage.setTimestamp(new Date().getTime());

            embedMessage.setAuthor({
                name: question
            })

            embedMessage.setTitle(response)

            embedMessage.setThumbnail('https://www.horoscope.com/images-US/games/game-magic-8-ball-no-text.png')

            message.channel.send({
                embeds: [embedMessage]
            });

    }

    //avatar command
    if (command === 'avatar') {
        const embedMessage =  new Discord.MessageEmbed()

        message.react('✅');  

            let id = args.slice(0).join(' ');

            if (id === '') {
                id = '<>' + message.author
            }

            embedMessage.setColor(
                emColor
            );
            embedMessage.setFooter({
                text: `Unlucky bot | Made by unlucky#8888`
            });
            embedMessage.setTimestamp(new Date().getTime());

            //make the id numbers only
            id = id.replace(/\D/g,'');

            //have fun:)
            client.users.fetch(id, false).then((user) => {
                embedMessage.setImage(user.displayAvatarURL({dynamic : true, size : 4096}));

                embedMessage.setTitle(user.tag);

                embedMessage.setDescription(
                    `**Links: ** [webp](${user.displayAvatarURL({dynamic : true, size : 4096, format : 'webp'})}) | [png](${user.avatarURL({size : 4096, format : 'png'})}) | [jpg](${user.avatarURL({size : 4096, format : 'jpg'})}) | [gif](${user.displayAvatarURL({dynamic : true, size : 4096, format : 'gif'})})`
                );

                message.channel.send({
                    embeds: [embedMessage]
                });
            });  
    }

    //avatar command
    if (command === 'reverse') {
        const embedMessage =  new Discord.MessageEmbed()

        message.react('✅');  

            let link = args.slice(0).join(' ');

            relink = "https://images.google.com/searchbyimage?image_url=" + link;

            embedMessage.setColor(
                emColor
            );
            embedMessage.setFooter({
                text: `Unlucky bot | Made by unlucky#8888`
            });
            embedMessage.setTimestamp(new Date().getTime());

            //have fun:)
            embedMessage.setTitle("REVERSE GOOGLE IMAGE SEARCH");

            embedMessage.setDescription(
                `Reverse link: [CLICK ON ME!](${relink})`
            );

            message.channel.send({
                embeds: [embedMessage]
            }); 
    }

    //servers command
    if (command === 'servers') {
        const embedMessage =  new Discord.MessageEmbed();
        const fs = require('fs');

        isServer = false;

        let address = args.slice(0).join(' ');

        if (address === '') {
            address = 'mc.unlucky.life'
        }

        const ips = [
            address
        ]

        waiting = ips.length * 10000 - 9500;
        waits = waiting/1000;

        try {
        for (const ipss of ips) {
            pinger.ping(ipss, 25565, (error, result) => {
            if (error) {
                embedMessage.setDescription(
                    "❌ " + `**${ipss}**` + '`' +  ` is offline! ${error}` + '`'
                );
                return;
            }
            var data = result.favicon.replace(/^data:image\/png;base64,/, "");

            var buffer = Buffer.from(data, "base64");

            fs.writeFileSync('server.png', buffer);

            embedMessage.setThumbnail('attachment://server.png')

            embedMessage.setDescription(
                "✅ " + `**${ipss}**` +  ` is online! \nPing: ${result.ping}, Version: ${result.version.name}\nPlayers: ${result.players.online}/${result.players.max}`
            );
            isServer = true;
        })
        }
        }
        catch {
            embedMessage.setDescription(
                "Something went wrong!"
            );
        }
        
        //message.reply('Waiting ' + waits + 's for pings to come back!') 

        await new Promise(resolve => setTimeout(resolve, waiting));

            embedMessage.setColor(
                emColor
            );
            embedMessage.setFooter({
                text: `Unlucky bot | Made by unlucky#8888`
            });
            embedMessage.setTimestamp(new Date().getTime());
            embedMessage.setTitle('Minecraft uptime checker');

        message.react('✅');

        if(!isServer) {
            message.channel.send({
                embeds: [embedMessage],
            }); 
        } 
        else {
            message.channel.send({
                embeds: [embedMessage],
                files: [{
                    attachment:'server.png',
                    name:'server.png'
                }]
            }); 
        }

        await new Promise(resolve => setTimeout(resolve, waiting));

        const path = './server.png'

        try {
            fs.unlinkSync(path)
            //file removed
        } catch(err) {
            console.error(err)
        }   
    }

    if (command === 'eur') {
        let amount = args.slice(0).join(' ');
        if (amount <= 0) amount = 1;
        if (amount >= 1)

        request('http://api.exchangeratesapi.io/v1/latest?access_key=' + conkeys, (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

        //embed time
        const embedMessage =  new Discord.MessageEmbed()
            embedMessage.setColor(
                emColor
            );
            embedMessage.setFooter({
                text: `Unlucky bot | Made by unlucky#8888`
            });
            embedMessage.setTimestamp(new Date().getTime());

            rmbrate = json.rates.CNY;

            eurtormb = amount*rmbrate;

            embedMessage.setTitle(amount + '€ = ' + eurtormb + '¥');

            embedMessage.setDescription(
                amount + ' EUR to RMB at rate 1€ = ' + rmbrate + '¥'
            );
        
        message.react('✅');

        message.channel.send({
            embeds: [embedMessage]
        });

    })
    }

    if (command === 'rmb') {
        let amount = args.slice(0).join(' ');
        if (amount <= 0) amount = 1;
        if (amount >= 1)

        request('http://api.exchangeratesapi.io/v1/latest?access_key=' + conkeys, (error, response, body) => {
                //parse json
                let json = JSON.parse(body);
                
        //embed time
        const embedMessage =  new Discord.MessageEmbed()
            embedMessage.setColor(
                emColor
            );
            embedMessage.setFooter({
                text: `Unlucky bot | Made by unlucky#8888`
            });
            embedMessage.setTimestamp(new Date().getTime());

            rmbrate = json.rates.CNY;

            rmbtoeur = amount/rmbrate;

            embedMessage.setTitle(amount + '¥ = ' + rmbtoeur.toFixed(2) + '€');

            embedMessage.setDescription(
                amount + ' RMB to EUR at rate 1€ = ' + rmbrate.toFixed(2) + '¥'
            );
    
        message.react('✅');  

        message.channel.send({
            embeds: [embedMessage]
        });

    });

    }

    if (command === 'mojangapi' || command === 'mojang') {
        function mojang() {
            // send a request to mojang
            request('https://api.mojang.com/', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                
                embedMessage.setTitle('Mojang API status')

                embedMessage.setDescription(
                    "**Status: " + json.Status + "**"
                );

                embedMessage.setThumbnail('https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Mojang_Studios_logo_2020.svg/1200px-Mojang_Studios_logo_2020.svg.png');

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        mojang();
    }


    if (command === 'check' || command === 'account' || command === 'mc' || command === 'nc') {
        function mojang() {
            let name = args.slice(0).join(' ');
            // send a request to mojang
            request('https://api.ashcon.app/mojang/v2/user/' + name, (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                
                embedMessage.setAuthor({ name: json.username, iconURL: 'https://mc-heads.net/head/' + name, url: 'https://namemc.com/profile/' + name })

                embedMessage.setThumbnail('https://mc-heads.net/body/' + name + '/right');

                var created

                if (json.created_at = 'null') {
                    created = 'unknown'
                }
                else
                (
                    created = json.created_at
                )

                //embedMessage.setImage('https://mc-heads.net/body/' + name + '/right')

                embedMessage.setDescription('**uuid**: ' + json.uuid + '\n**Renamed**: ' + json.username_history.length + ' times' + '\n**Created at:** ' + created)

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        mojang();
    }


    if (command === 'boobs' || command === 'tits' || command === 'boobies') {
        //get random number with 5 digits
        boobnumber = ("00000" + getRandomInt(16800)).slice(-5)

        //embed time
        const embedMessage =  new Discord.MessageEmbed()
            embedMessage.setColor(
                emColor
            );
            embedMessage.setFooter({
                text: `Unlucky bot | Made by unlucky#8888`
            });
            embedMessage.setTimestamp(new Date().getTime());
            embedMessage.setTitle('Boobies #' + boobnumber);
            embedMessage.setImage('http://media.oboobs.ru/boobs_preview/' + boobnumber + '.jpg');
    
        message.react('✅');

        message.channel.send({
            embeds: [embedMessage]
        });

    }

    if (command === 'ass' || command === 'butt' || command === 'butts') {
        //get random number with 5 digits
        buttnumber = ("00000" + getRandomInt(8473)).slice(-5)

        //embed time
        const embedMessage =  new Discord.MessageEmbed()
            embedMessage.setColor(
                emColor
            );
            embedMessage.setFooter({
                text: `Unlucky bot | Made by unlucky#8888`
            });
            embedMessage.setTimestamp(new Date().getTime());
            embedMessage.setTitle('Butt #' + buttnumber);
            embedMessage.setImage('http://media.obutts.ru/butts_preview/' + buttnumber + '.jpg');
    
        message.react('✅');

        message.channel.send({
            embeds: [embedMessage]
        });

    }

    if (command === 'cat') {
        function catto() {
            // send a request to blockchain
            request('https://api.thecatapi.com/v1/images/search?format=json&x-api-key=' + catapi, (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                embedMessage.setTitle('Catto #' + json[0].id)

                embedMessage.setImage(json[0].url);

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        catto();
    }

    if (command === 'dog') {
        function doggo() {
            // send a request to blockchain
            request('https://dog.ceo/api/breeds/image/random', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                embedMessage.setTitle('Doggo')

                embedMessage.setImage(json.message);

                message.react('✅');
                
                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        doggo();
    }

    if (command === 'fox') {
        function fox() {
            // send a request to blockchain
            request('https://randomfox.ca/floof/', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                embedMessage.setTitle('Fox')

                embedMessage.setImage(json.image);

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        fox();
    }

    if (command === 'neko') {
        function neko() {
            // send a request to blockchain
            request('https://nekos.life/api/neko', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                embedMessage.setTitle('Neko')

                embedMessage.setImage(json.neko);

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        neko();
    }

    if (command === 'bird' || command === 'birb') {
        function birb() {
            // send a request to blockchain
            request('https://some-random-api.ml/img/birb', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                
                embedMessage.setTitle('Birb')

                embedMessage.setImage(json.link);

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        birb();
    }

    if (command === 'pika') {
        function pika() {
            // send a request to blockchain
            request('https://some-random-api.ml/img/pikachu', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                
                embedMessage.setTitle('Pika pika')

                embedMessage.setImage(json.link);

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        pika();
    }

    if (command === 'meme') {
        function pika() {
            // send a request to blockchain
            request('https://some-random-api.ml/meme', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                
                embedMessage.setTitle(json.caption)

                embedMessage.setAuthor({
                    name: 'Meme category: ' + json.category
                })

                embedMessage.setImage(json.image);

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        pika();
    }

    if (command === 'birdfact') {
        function fact() {
            // send a request to blockchain
            request('https://some-random-api.ml/facts/bird', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                
                embedMessage.addField("Birb fact🐦", json.fact)

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        fact();
    }

    if (command === 'lewd') {
        function lewd() {
            // send a request to blockchain
            request('https://nekos.life/api/v2/img/lewd', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                embedMessage.setTitle('LEWD')

                embedMessage.setImage(json.url);

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        lewd();
    }


    if (command === 'newavatar') {
        function newavatar() {
            // send a request to blockchain
            request('https://nekos.life/api/v2/img/avatar', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                embedMessage.setTitle('Your new avatar')

                embedMessage.setImage(json.url);

                message.react('✅');
                
                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        newavatar();
    }

    //btc command
    if (command === 'btc' || command === 'bitcoin') {

        function BTC() {
            // send a request to blockchain
            request('https://api.coindesk.com/v1/bpi/currentprice.json', (error, response, body) => {
                //parse json
                let json = JSON.parse(body);

                //embed stuff
                //embeds
                const embedMessage =  new Discord.MessageEmbed()
                embedMessage.setColor(
                   emColor
                )
                embedMessage.setFooter({
                    text: `Unlucky bot | Made by unlucky#8888`
                })
                embedMessage.setTimestamp(new Date().getTime());
                embedMessage.setAuthor({
                    name: "Bitcoin",
                    iconURL: 'https://cdn.pixabay.com/photo/2013/12/08/12/12/bitcoin-225079_960_720.png'
                })

                embedMessage.addFields(
                    {name: '**USD:**', value: json.bpi.USD.rate, inline: true},
                    {name: '**EUR:**', value: json.bpi.EUR.rate, inline: true},
                    {name: '**GBP:**', value: json.bpi.GBP.rate, inline: true}
                );

                message.react('✅');

                message.channel.send({
                    embeds: [embedMessage]
                });

            });
        }

        //call function
        BTC();
    }
})