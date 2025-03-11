const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcplayerinfo')
    .setDescription('Get information about a Minecraft player, including cape status')
    .addStringOption(option => 
      option.setName('player')
        .setDescription('Minecraft username')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply(); // Defer for API calls

    const playerName = interaction.options.getString('player');
    try {
      // Get UUID from Mojang API
      const uuidResponse = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);
      const { id: uuid, name } = uuidResponse.data;
      if (!uuid) throw new Error('Player not found');

      // Get name history from Mojang API
      const nameHistoryResponse = await axios.get(`https://api.mojang.com/user/profiles/${uuid}/names`);
      const nameHistory = nameHistoryResponse.data.map(entry => entry.name).join(', ') || 'N/A';

      // Check for cape using NameMC API (unofficial but widely used)
      let capeInfo = 'N/A';
      try {
        const nameMCResponse = await axios.get(`https://api.namemc.com/profile/${uuid}`);
        const profile = nameMCResponse.data;
        capeInfo = profile.cape ? `Yes (${profile.cape.type || 'Unknown Type'})` : 'No';
      } catch (capeError) {
        console.warn('Cape check failed, defaulting to N/A:', capeError.message);
        capeInfo = 'N/A (Check failed, may require manual verification)';
      }

      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setTitle(`<:hardcore:1349082951056359504> Player Info: ${name}`)
        .addFields(
          { name: 'UUID', value: uuid, inline: false },
          { name: 'Name History', value: nameHistory, inline: false },
          { name: 'Cape', value: capeInfo, inline: true },
          { name: 'Skin', value: `[Download Skin](https://crafatar.com/skins/${uuid})`, inline: true }
        )
        .setThumbnail(`https://crafatar.com/avatars/${uuid}?size=100&overlay`)
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life | Note: Cape info may not reflect modded or private capes' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('MC Player Info error:', error);
      const embed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setTitle(`<:hardcore:1349082951056359504> Player Info: ${playerName}`)
        .setDescription('Failed to fetch player info. Check the username or try again later.')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    }
  },
};