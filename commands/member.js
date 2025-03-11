const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('member')
    .setDescription('Shows information about a server member')
    .addUserOption(option => option.setName('user').setDescription('The user to check (optional, defaults to you)').setRequired(false)),
  async execute(interaction) {
    await interaction.deferReply(); // Defer reply for potential message count processing

    const targetUser = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(targetUser.id) || await interaction.guild.members.fetch(targetUser.id);
    if (!member) {
      await interaction.editReply({ content: 'User not found in this server!', ephemeral: true });
      return;
    }

    // Calculate time in server
    const joinedDate = new Date(member.joinedTimestamp);
    const timeInServer = Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24)); // Days

    // Get highest role
    const highestRole = member.roles.highest.name || 'None';

    // Calculate account age
    const createdDate = new Date(targetUser.createdTimestamp);
    const accountAgeDays = Math.floor((Date.now() - targetUser.createdTimestamp) / (1000 * 60 * 60 * 24)); // Days

    // Estimate message count (limited to recent 100 messages in current channel)
    let messageCount = 0;
    try {
      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      messageCount = messages.filter(msg => msg.author.id === targetUser.id).size;
    } catch (error) {
      console.error('Error fetching message count:', error);
      messageCount = 'Unable to calculate (permission or error)';
    }

    // Create embed
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle(`<:ID:1349072156021227531> Member Info: ${targetUser.username}`)
      .addFields(
        { name: 'Joined Server', value: `${joinedDate.toLocaleDateString()} (${timeInServer} days ago)`, inline: false },
        { name: 'Highest Role', value: highestRole, inline: false },
        { name: 'Account Age', value: `${createdDate.toLocaleDateString()} (${accountAgeDays} days ago)`, inline: false },
      )
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};