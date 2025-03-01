const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays a user\'s avatar')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose avatar to display (defaults to you)')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle(`${user.tag}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setDescription(
        `**Links:** [webp](${user.displayAvatarURL({ dynamic: true, size: 4096, format: 'webp' })}) | ` +
        `[png](${user.avatarURL({ size: 4096, format: 'png' })}) | ` +
        `[jpg](${user.avatarURL({ size: 4096, format: 'jpg' })}) | ` +
        `[gif](${user.displayAvatarURL({ dynamic: true, size: 4096, format: 'gif' })})`
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};