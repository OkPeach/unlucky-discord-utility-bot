const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catgirl')
    .setDescription('Get a random anime-style catgirl (neko) image'),
  async execute(interaction) {
    try {
      const response = await fetch('https://nekos.life/api/v2/img/neko');
      const data = await response.json();
      const catgirlImage = data.url;

      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setTitle('<a:ChocolaBlushing:1349064184817778859> Random Catgirl')
        .setImage(catgirlImage)
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('Failed to fetch a catgirl image. Try again later!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};