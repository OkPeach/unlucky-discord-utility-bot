const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Posts the server rules in the current channel')
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

    // Check if user has one of the admin roles or ManageMessages permission
    const memberRoles = interaction.member.roles.cache;
    const hasAdminRole = adminRoles.some(roleId => memberRoles.has(roleId));

    if (!hasAdminRole && !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('You don’t have permission to use this command!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Create the rules embed
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('<:Rules:1349073961689813112> Server Rules <:readrules_IDS:1349073968857878611>')
      .setDescription('Here are the rules for our chill server! Follow them to keep things fun for everyone.')
      .addFields(
        { name: '1. Be Respectful', value: 'No toxicity, harassment, or drama. We’re here to have fun!', inline: false },
        { name: '2. Keep It SFW', value: 'No NSFW content—let’s keep it chill for everyone.', inline: false },
        { name: '3. No Spamming', value: 'Don’t flood the chat with messages, emojis, or soundboard overuse.', inline: false },
        { name: '4. Follow Discord’s Rules', value: 'Stick to Discord’s Terms of Service and Community Guidelines.', inline: false },
        { name: '5. Have Fun!', value: 'That’s the only real rule—enjoy your time here! 🎉', inline: false }
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    // Reply with the rules embed
    await interaction.reply({ embeds: [embed] });
  },
};