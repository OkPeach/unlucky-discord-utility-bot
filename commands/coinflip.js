const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin to get heads or tails'),
  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('🪙 Coin Flip')
      .setDescription(`The coin landed on **${result}**!`)
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};