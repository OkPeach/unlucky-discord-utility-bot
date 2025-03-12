const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcserverinfo')
    .setDescription('Get detailed information about a Minecraft server')
    .addStringOption(option => 
      option.setName('ip')
        .setDescription('Server IP or address (e.g., play.hypixel.net or 192.168.1.1:25565)')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply(); // Defer reply for processing

    const address = interaction.options.getString('ip');
    console.log('Address provided:', address); // Debug log

    if (!address) {
      console.error('Address is null or undefined');
      const embedMessage = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setTitle(`<:pepemom:1349062021697634344> Error`)
        .setDescription('No server address provided! Please specify an IP.')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return await interaction.editReply({ embeds: [embedMessage] });
    }

    const embedMessage = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    try {
      // Split address into host and port
      let host = address;

      //console.log('Host:', host); // Debug log

      // Fetch server info using minecraft-server-util
      const result = await status(host);

      //console.log('Server info result:', result); // Debug log

      if (!result) {
        embedMessage.setTitle(`<:Earth_Minecraft:1349082932844957708> ${address} is offline or unreachable!`);
        return await interaction.editReply({ embeds: [embedMessage] });
      }

      embedMessage.setTitle(`<:Earth_Minecraft:1349082932844957708> ${address} is online!`);

      // Handle server icon
      let filePath;
      if (result.favicon) {
        const base64Data = result.favicon.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        filePath = path.join(__dirname, 'server.png');
        fs.writeFileSync(filePath, buffer);

        const attachment = new AttachmentBuilder(filePath, { name: 'server.png' });
        embedMessage.setThumbnail('attachment://server.png');

              // Add server info fields based on the result structure
      embedMessage.addFields(
        { name: 'Players:', value: `${result.players.online || 0}/${result.players.max || 'N/A'}`, inline: true },
        { name: 'Version:', value: result.version.name || 'Unknown', inline: true },
        { name: 'Latency:', value: `${result.roundTripLatency || 'N/A'} ms`, inline: true },
        { name: 'MOTD:', value: result.motd.clean || 'No MOTD', inline: false },
      );


        // Send the embed with the attachment
        await interaction.editReply({ embeds: [embedMessage], files: [attachment] });
      } else {
        // Send the embed without an attachment if no icon
        await interaction.editReply({ embeds: [embedMessage] });
      }

      // Clean up the temporary file if it exists
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('MC Server Info error:', error);
      embedMessage.setTitle(`<:Earth_Minecraft:1349082932844957708> Error`)
        .setDescription('Something went wrong while fetching server info! Check the address or try again later.');
      await interaction.editReply({ embeds: [embedMessage] });
    }
  },
};