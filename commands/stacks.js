const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stacks')
    .setDescription('Calculate how many Minecraft stacks and remaining items you need')
    .addIntegerOption(option => 
      option.setName('item-count')
        .setDescription('The total number of items')
        .setRequired(true)
        .setMinValue(0)
    ),
  async execute(interaction) {
    await interaction.deferReply(); // Defer for processing

    const itemCount = interaction.options.getInteger('item-count');
    const stackSize = 64; // Standard Minecraft stack size
    const fullStacks = Math.floor(itemCount / stackSize);
    const remainingItems = itemCount % stackSize;

    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle(`<:MinecraftDiamond:1349082941153869926> Stack Calculator`)
      .addFields(
        { name: 'Total Items', value: itemCount.toString(), inline: true },
        { name: 'Full Stacks', value: fullStacks.toString(), inline: true },
        { name: 'Remaining Items', value: remainingItems.toString(), inline: true }
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};