const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll dice (e.g., 1d6, 2d20)')
    .addStringOption(option =>
      option.setName('dice')
        .setDescription('Dice to roll (format: NdS, e.g., 1d6, 2d20)')
        .setRequired(true)),
  async execute(interaction) {
    const dice = interaction.options.getString('dice');
    const diceRegex = /^(\d+)d(\d+)$/;
    const match = dice.match(diceRegex);

    if (!match) {
      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('Invalid dice format! Use NdS (e.g., 1d6, 2d20).')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const numDice = parseInt(match[1]);
    const sides = parseInt(match[2]);

    if (numDice < 1 || numDice > 100 || sides < 1 || sides > 1000) {
      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('Please use 1-100 dice and sides between 1-1000!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const rolls = [];
    let total = 0;
    for (let i = 0; i < numDice; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }

    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('🎲 Dice Roll')
      .addFields(
        { name: 'Dice', value: dice, inline: false },
        { name: 'Rolls', value: rolls.join(', '), inline: false },
        { name: 'Total', value: total.toString(), inline: false }
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};