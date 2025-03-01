const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Shows the bot\'s uptime'),
  async execute(interaction) {
    const totalSeconds = interaction.client.uptime / 1000;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('Uptime')
      .setDescription(`My uptime is ${uptime}`)
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};