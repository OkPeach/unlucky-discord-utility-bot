const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows bot and API latency'),
  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('Ping')
      .setDescription(`Bot Latency: ${latency}ms\nAPI Latency: ${Math.round(interaction.client.ws.ping)}ms`)
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};