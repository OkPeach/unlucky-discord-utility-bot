const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcserverinfo')
    .setDescription('Get detailed information about a Minecraft server')
    .addStringOption(option => 
      option.setName('server')
        .setDescription('Server IP or address (e.g., play.hypixel.net)')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply(); // Defer for API call

    const serverAddress = interaction.options.getString('server');
    try {
      const response = await axios.get(`https://api.mcstatus.io/v2/status/java/${serverAddress}`);
      const data = response.data;

      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setTitle(`<:Earth_Minecraft:1349082932844957708> Server Info: ${serverAddress}`)
        .setDescription(data.online ? 'Server is **online**.' : 'Server is **offline**.')
        .addFields(
          { name: 'IP:Port', value: `${data.ip}:${data.port}`, inline: true },
          { name: 'Players', value: data.online ? `${data.players.online}/${data.players.max}` : 'N/A', inline: true },
          { name: 'Version', value: data.online ? (data.version.name || 'Unknown') : 'N/A', inline: true },
          { name: 'Software', value: data.online ? (data.software || 'Unknown') : 'N/A', inline: true },
          { name: 'MOTD', value: data.online ? (data.motd.clean || 'No MOTD') : 'N/A', inline: false },
          { name: 'Plugins', value: data.online && data.plugins ? data.plugins.join(', ') : 'N/A', inline: false }
        )
        .setThumbnail(data.online && data.icon ? data.icon : 'https://minecraftskinstealer.com/api/v1/helmet/Steve')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('MC Server Info error:', error);
      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setTitle(`<:Earth_Minecraft:1349082932844957708> Server Info: ${serverAddress}`)
        .setDescription('Failed to fetch server info. Check the IP or try again later.')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    }
  },
};