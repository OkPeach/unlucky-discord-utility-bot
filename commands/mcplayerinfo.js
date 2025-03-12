const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcplayerinfo')
    .setDescription('Get detailed information about a Minecraft player')
    .addStringOption(option => 
      option.setName('username')
        .setDescription('Minecraft username (e.g., LucienETH)')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply(); // Defer reply for processing

    const username = interaction.options.getString('username');
    console.log('Username provided:', username); // Debug log

    if (!username) {
      console.error('Username is null or undefined');
      const embedMessage = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setTitle(`<:pepemom:1349062021697634344> Error`)
        .setDescription('No username provided! Please specify a Minecraft username.')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return await interaction.editReply({ embeds: [embedMessage] });
    }

    const embedMessage = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    try {
      // Fetch player info from Ashcon API using axios
      const apiUrl = `https://api.ashcon.app/mojang/v2/user/${encodeURIComponent(username)}`;
      const response = await axios.get(apiUrl);
      const result = response.data;

      console.log(result)

      // Set embed author with username, head image, and NameMC link
      embedMessage.setAuthor({
        name: result.username,
        iconURL: `https://mc-heads.net/head/${result.username}`,
        url: `https://namemc.com/profile/${result.username}`
      });

      // Set thumbnail with body image
      embedMessage.setThumbnail(`https://mc-heads.net/body/${result.username}/right`);

      // Handle created_at
      const created = result.created_at === null || result.created_at === 'null' 
        ? 'Unknown' 
        : new Date(result.created_at).toLocaleDateString();

      // Check for cape
      const capeStatus = result.cape && result.cape.url
        ? `✅ Yes ([view](${result.cape.url}))`
        : '❌ No';

      // Add description with player info, including cape
      embedMessage.setDescription(
        `**UUID:** ${result.uuid}\n` +
        `**Renamed:** ${result.username_history.length} times\n` +
        `**Created at:** ${created}\n` +
        `**Cape:** ${capeStatus}`
      );

      // Send the embed
      await interaction.editReply({ embeds: [embedMessage] });

    } catch (error) {
      console.error('MC Player Info error:', error.response ? error.response.data : error.message);
      embedMessage.setTitle(`<:pepemom:1349062021697634344> Error`)
        .setDescription(`Failed to fetch player info for ${username || 'unknown user'}! Check the username or try again later.`);
      await interaction.editReply({ embeds: [embedMessage] });
    }
  },
};