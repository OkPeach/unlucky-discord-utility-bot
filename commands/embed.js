const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create a custom embed message (admin only)')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('The title of the embed')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('The description of the embed')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('thumbnail')
        .setDescription('URL for the embed thumbnail (small image on the right)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('image')
        .setDescription('URL for the embed image (large image at the bottom)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('footer')
        .setDescription('Custom footer text (defaults to bot signature)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('field1_name')
        .setDescription('Name of the first custom field')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('field1_value')
        .setDescription('Value of the first custom field')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('field1_inline')
        .setDescription('Should the first field be inline? (default: false)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('field2_name')
        .setDescription('Name of the second custom field')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('field2_value')
        .setDescription('Value of the second custom field')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('field2_inline')
        .setDescription('Should the second field be inline? (default: false)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('field3_name')
        .setDescription('Name of the third custom field')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('field3_value')
        .setDescription('Value of the third custom field')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('field3_inline')
        .setDescription('Should the third field be inline? (default: false)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#' + process.env.EMBEDCOLOR)
        .setDescription('You don’t have permission to use this command!')
        .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Gather input options
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const thumbnail = interaction.options.getString('thumbnail');
    const image = interaction.options.getString('image');
    const footer = interaction.options.getString('footer');

    // Build the embed
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTimestamp();

    // Set optional fields if provided
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (image) embed.setImage(image);
    if (footer) {
      embed.setFooter({ text: footer });
    } else {
      embed.setFooter({ text: 'Unlucky bot | Made by unlucky.life' });
    }

    // Add custom fields if provided
    const fields = [];
    for (let i = 1; i <= 3; i++) {
      const name = interaction.options.getString(`field${i}_name`);
      const value = interaction.options.getString(`field${i}_value`);
      const inline = interaction.options.getBoolean(`field${i}_inline`) || false;

      if (name && value) {
        fields.push({ name, value, inline });
      }
    }

    if (fields.length > 0) {
      embed.addFields(fields);
    }

    // If no title, description, or fields are provided, add a default message
    if (!title && !description && fields.length === 0) {
      embed.setDescription('This is a custom embed! You can add a title, description, or fields next time.');
    }

    // Send the embed
    await interaction.reply({ embeds: [embed] });
  },
};