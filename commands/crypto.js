const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crypto')
    .setDescription('Fetches the current price of a selected cryptocurrency in USD'),
  async execute(interaction) {
    // Defer reply since API calls take time and we'll show a select menu
    await interaction.deferReply();

    // Define cryptocurrency options with their CoinGecko IDs and custom emoji IDs
    const cryptoOptions = {
      bitcoin: { id: 'bitcoin', emoji: '<:bitcoin:1349045897132113940>', name: 'Bitcoin (BTC)' },
      ethereum: { id: 'ethereum', emoji: '<:ethereum:1349045912663752844>', name: 'Ethereum (ETH)' },
      litecoin: { id: 'litecoin', emoji: '<:litecoin:1349047317864386681>', name: 'Litecoin (LTC)' },
      solana: { id: 'solana', emoji: '<:solana:1349047341390237789>', name: 'Solana (SOL)' },
      dogecoin: { id: 'dogecoin', emoji: '<:dogecoin:1349049381441110087>', name: 'Dogecoin (DOGE)' },
      pepe: { id: 'pepe', emoji: '<:pepe:1349049371315933205>', name: 'Pepe (PEPE)' },
    };

    // Create the select menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('crypto_select')
      .setPlaceholder('Choose a cryptocurrency')
      .addOptions(
        Object.entries(cryptoOptions).map(([key, value]) => ({
          label: value.name,
          value: key,
          description: `View the current price of ${value.name}`,
        }))
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Send the initial message with the select menu
    const response = await interaction.editReply({
      content: 'Please select a cryptocurrency from the dropdown below:',
      components: [row],
    });

    // Create a collector to handle the selection
    const filter = i => i.customId === 'crypto_select' && i.user.id === interaction.user.id;
    const collector = response.createMessageComponentCollector({ filter, time: 60000 }); // 60-second timeout

    collector.on('collect', async i => {
      const selectedCrypto = cryptoOptions[i.values[0]];
      await i.deferUpdate(); // Defer update while fetching data

      try {
        // Fetch price data from CoinGecko API
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto.id}&vs_currencies=usd&include_24hr_change=true`
        );
        const cryptoData = response.data[selectedCrypto.id];
        const price = cryptoData.usd;
        const change24h = cryptoData.usd_24h_change.toFixed(2); // Round to 2 decimal places

        // Create embed with selected crypto data
        const embed = new EmbedBuilder()
          .setColor('#' + process.env.EMBEDCOLOR)
          .setTitle(`${selectedCrypto.emoji} ${selectedCrypto.name} Price`)
          .addFields(
            { name: 'Price (USD)', value: `$${price.toLocaleString()}`, inline: true },
            { name: '24h Change', value: `${change24h}%`, inline: true }
          )
          .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
          .setTimestamp();

        await i.editReply({
          content: `Showing price for ${selectedCrypto.name}:`,
          embeds: [embed],
          components: [], // Remove the select menu after selection
        });
      } catch (error) {
        console.error(`Error fetching ${selectedCrypto.name} price:`, error.message);
        const errorEmbed = new EmbedBuilder()
          .setColor('#' + process.env.EMBEDCOLOR)
          .setDescription(`Failed to fetch ${selectedCrypto.name} price. Please try again later.`)
          .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
          .setTimestamp();
        await i.editReply({
          content: `Error fetching ${selectedCrypto.name}:`,
          embeds: [errorEmbed],
          components: [], // Remove the select menu on error
        });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({
          content: 'Selection timed out after 60 seconds. Use `/crypto` to try again.',
          components: [],
        });
      }
    });
  },
};