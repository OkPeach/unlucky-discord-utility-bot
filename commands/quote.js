const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Get a random inspirational quote'),
  async execute(interaction) {
    try {
      const response = await fetch('http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json');
      const data = await response.json();
      const quoteText = data.quoteText;
      const quoteAuthor = data.quoteAuthor || 'Unknown';

      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setTitle('💡 Inspirational Quote')
        .setDescription(`"${quoteText}"\n— ${quoteAuthor}`)
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('Failed to fetch a quote. Try again later!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};