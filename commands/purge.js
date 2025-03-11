const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes a specified number of messages')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    // Define admin role IDs from .env
    const adminRoles = [
      process.env.ADMINID,
      process.env.ADMIN2ID,
      process.env.ADMIN3ID,
      process.env.MODERATORID,
      process.env.HELPERID,
    ];

    // Check if user has one of the admin roles
    const memberRoles = interaction.member.roles.cache;
    const hasAdminRole = adminRoles.some(roleId => memberRoles.has(roleId));

    if (!hasAdminRole && !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('You don’t have permission to use this command!')
        .setTitle(`<:moderation:1349057042467520554> Purge`)
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const amount = interaction.options.getInteger('amount');
    const channel = interaction.channel;

    const { size } = await channel.bulkDelete(amount, true);
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle(`<:moderation:1349057042467520554> Purge`)
      .setDescription(`Purged ${size} messages!`)
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};