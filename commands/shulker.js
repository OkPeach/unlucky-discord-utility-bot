const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shulker')
    .setDescription('Calculate how many shulker boxes you need')
    .addIntegerOption(option => 
      option.setName('item-count')
        .setDescription('The total number of items')
        .setRequired(true)
        .setMinValue(0)
    ),
  async execute(interaction) {
    await interaction.deferReply(); // Defer for processing

    const itemCount = interaction.options.getInteger('item-count');
    const shulkerBoxCapacity = 1728; // 27 slots * 64 items per stack
    const sbCount = itemCount / shulkerBoxCapacity;
    const sbCountRounded = sbCount.toFixed(2);

    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle(`<:Shulker_Box:1349083098335412265> Shulker Box Calculator`)
      .addFields(
        { name: 'Total Items', value: itemCount.toString(), inline: true },
        { name: 'Shulker Boxes Needed', value: sbCountRounded.toString(), inline: true }
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};