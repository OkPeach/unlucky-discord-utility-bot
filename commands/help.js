const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available slash commands'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('<:slash_command:1349062310102306886> Command List')
      .setDescription('Here are all my slash commands:')
      .addFields(
        { 
          name: '<:pepemom:1349062021697634344> General', 
          value: '`/ping` - Check latency\n`/uptime` - Bot uptime\n`/avatar` - Show user avatar\n`/help` - This menu\n`/member` - Show member information' 
        },
        { 
          name: '<:moderation:1349057042467520554> Moderation', 
          value: '`/kick` - Kick a user\n`/purge` - Delete messages\n`/rules` - Post the server rules\n`/embed` - Create a custom embed message\n`/selfrole` - Set up a self-role message' 
        },
        { 
          name: '<a:ConfettiPopper:1349062013351100486> Fun', 
          value: '`/8ball` - Ask the Magic 8 Ball a question\n`/chucknorris` - Get a Chuck Norris joke\n`/quote` - Get an inspirational quote\n`/coinflip` - Flip a coin\n`/roll` - Roll dice (e.g., 1d6, 2d20)\n`/meme` - Get a random meme\n`/penis` - Penis size' 
        },
        {
          name: '<a:neko_gasp:1349061996615696465> Images',
          value: '`/cat` - Get a random cat image\n`/dog` - Get a random dog image\n`/catgirl` - Get a random anime-style catgirl'
        },
        {
          name: '<a:PenguBitcoin:1349061239845818489> Crypto',
          value: '`/crypto` - View prices for Bitcoin, Ethereum, Litecoin, Solana, Dogecoin, and Pepe'
        }
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};