const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('penis')
    .setDescription('Shows the "totally not rigged" penis size of a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to measure (defaults to you)')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    // Hardcoded user IDs from your old code
    const lucienId = '353871885722845188';
    const kevinId = '555464519888011307';
    const elopiId = '329305299997556738';

    let penisSize;
    if (user.id === lucienId) {
      penisSize = 25;
    } else if (user.id === kevinId) {
      penisSize = 0;
    } else if (user.id === elopiId) {
      penisSize = 5;
    } else {
      penisSize = Math.floor(Math.random() * 20); // Random size between 0-19
    }

    // Generate the visual representation
    const penis = '='.repeat(penisSize);

    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('🍆 <a:pe:1349063478081617990><a:nis:1349063495471202314> Size')
      .setDescription(`${user.username}'s penis size is ${penisSize}cm\n8${penis}D💦`)
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};