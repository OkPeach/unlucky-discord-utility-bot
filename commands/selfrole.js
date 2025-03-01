const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('selfrole')
    .setDescription('Set up a self-role message that users can react to for a role (admin only)')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role users will receive by reacting')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    // Define admin role IDs from .env
    const adminRoles = [
      process.env.ADMINID,
      process.env.ADMIN2ID,
      process.env.ADMIN3ID,
      process.env.MODERATORID,
      process.env.HELPERID,
    ];

    // Check if user has one of the admin roles or ManageRoles permission
    const memberRoles = interaction.member.roles.cache;
    const hasAdminRole = adminRoles.some(roleId => memberRoles.has(roleId));

    if (!hasAdminRole && !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('You don’t have permission to use this command!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const role = interaction.options.getRole('role');
    const channelId = '949710436616519700';
    const channel = interaction.guild.channels.cache.get(channelId);

    if (!channel) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('Role assignment channel not found!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Check bot permissions
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('I don’t have permission to manage roles!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Check role hierarchy
    const botHighestRole = interaction.guild.members.me.roles.highest;
    if (botHighestRole.position <= role.position) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription(`I can’t assign the role <@&${role.id}> because it’s higher than my highest role (${botHighestRole.name})!`)
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Create the self-role message
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('🎉 Self-Role Assignment')
      .setDescription(`React with ✅ to receive the <@&${role.id}> role!`)
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    try {
      const message = await channel.send({ embeds: [embed] });
      await message.react('✅');

      // Save the message ID, role ID, and channel ID to selfrole.json
      const selfRoleData = {
        messageId: message.id,
        roleId: role.id,
        channelId: channel.id,
      };
      fs.writeFileSync('./selfrole.json', JSON.stringify(selfRoleData, null, 2));

      const confirmEmbed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription(`Self-role message set up! Users can now react to receive the <@&${role.id}> role.`)
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
    } catch (error) {
      console.error('Failed to set up self-role message:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('Failed to set up the self-role message. Check my permissions!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};