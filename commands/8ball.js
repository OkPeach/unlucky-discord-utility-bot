const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the Magic 8 Ball a question')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Your yes/no question for the 8 Ball')
        .setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    
    // Hardcoded list of 8 Ball responses
    const responses = [
      'That is a resounding no',
      'It is not looking likely',
      'Too hard to tell',
      'It is quite possible',
      'That is a definite yes!',
      'Maybe',
      'There is a good chance',
      'Signs point to yes',
      'Don’t count on it',
      'My sources say no',
      'Outlook not so good',
      'Reply hazy, try again',
      'Ask again later',
      'Better not tell you now',
      'Cannot predict now',
      'Concentrate and ask again',
      'Yes, definitely',
      'You may rely on it',
      'As I see it, yes',
      'Most likely'
    ];

    // Pick a random response
    const answer = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('🎱 Magic 8 Ball')
      .addFields(
        { name: 'Question', value: question, inline: false },
        { name: 'Answer', value: answer, inline: false }
      )
      .setThumbnail('https://www.horoscope.com/images-US/games/game-magic-8-ball-no-text.png') // Optional thumbnail for flair
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};