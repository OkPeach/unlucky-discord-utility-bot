const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('colorrole')
    .setDescription('Choose a color role by reacting to the message!'),

  async execute(interaction) {
    await interaction.deferReply(); // Defer reply for processing

    const colorRoles = [
      { name: 'Black', emoji: '⚫', roleId: '1349785923067576442' },
      { name: 'Red', emoji: '🔴', roleId: '1349786107847639132' },
      { name: 'Purple', emoji: '🟣', roleId: '1349786421807943742' },
      { name: 'Orange', emoji: '🟠', roleId: '1349786354682302596' },
      { name: 'Green', emoji: '🟢', roleId: '1349786258989383782' },
      { name: 'Yellow', emoji: '🟡', roleId: '1349786623394578472' },
      { name: 'White', emoji: '⚪', roleId: '1349786791829569556' },
    ];

    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('🎨 Choose Your Color Role!')
      .setDescription(
        'React with the emoji corresponding to the color role you want:\n\n' +
        colorRoles.map(color => `${color.emoji} **${color.name}**`).join('\n')
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    // Send the embed
    const message = await interaction.editReply({ embeds: [embed], fetchReply: true });

    // Add reactions in order
    for (const color of colorRoles) {
      await message.react(color.emoji).catch(console.error);
    }

    // Store the message ID in a JSON file
    const colorRoleData = {
      guildId: interaction.guild.id,
      channelId: interaction.channel.id,
      messageId: message.id,
    };

    const filePath = path.join(__dirname, '..', 'colorrole.json');
    fs.writeFileSync(filePath, JSON.stringify(colorRoleData, null, 2), 'utf8');
    console.log(`Stored color role message ID: ${message.id}`);
  },
};