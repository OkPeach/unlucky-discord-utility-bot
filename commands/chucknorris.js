const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chucknorris')
    .setDescription('Get a random Chuck Norris joke'),
  async execute(interaction) {
    try {
      const response = await fetch('https://api.chucknorris.io/jokes/random');
      const data = await response.json();
      const joke = data.value;

      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setTitle('😂 Chuck Norris Joke')
        .setDescription(joke)
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('Failed to fetch a Chuck Norris joke. Try again later!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};