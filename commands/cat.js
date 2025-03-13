const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Get a random cat image'),
  async execute(interaction) {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();
      const catImage = data[0].url;

      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setTitle('🐱 Random Cat')
        .setImage(catImage)
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('Failed to fetch a cat image. Try again later!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};