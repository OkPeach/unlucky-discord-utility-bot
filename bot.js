require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActivityType, REST, Routes, AuditLogEvent } = require('discord.js');
const fs = require('fs');

// Define client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildEmojisAndStickers, // Required for emoji events
  ],
  partials: ['CHANNEL', 'MESSAGE', 'REACTION'],
});

// Collection for commands
client.commands = new Collection();

// Load commands from commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// REST for command deployment
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Helper function to send logs to the log channel
const sendLog = async (embed) => {
  const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
  if (!logChannel) {
    console.error('Log channel not found! Check LOG_CHANNEL_ID in .env.');
    return;
  }
  try {
    await logChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Failed to send log:', error);
  }
};

// Bot ready event - Deploy guild commands on startup
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Deploy guild commands
  try {
    const commands = [];
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
    }

    console.log('Deploying guild commands...');
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
    console.log('Successfully deployed guild commands!');
  } catch (error) {
    console.error('Failed to deploy guild commands:', error);
  }

  // Set presence (rotating status)
  const nameArray = ['with your mom', 'type /help', '34 Commands', 'now with music!'];
  const typeArray = [
    ActivityType.Playing,
    ActivityType.Playing,
    ActivityType.Listening,
    ActivityType.Playing,
  ];
  const statusArray = ['dnd', 'online', 'online', 'online'];
  let index = 0;

  setInterval(() => {
    if (index >= nameArray.length) index = 0;
    const names = nameArray[index];
    const statuses = statusArray[index];
    const types = typeArray[index];
    client.user.setPresence({ 
      activities: [{ name: names, type: types }], 
      status: statuses 
    });
    index++;
  }, 10000);
});

// Log message deletions
client.on('messageDelete', async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  const embed = new EmbedBuilder()
    .setColor('#' + process.env.EMBEDCOLOR)
    .setTitle('Message Deleted')
    .addFields(
      { name: 'Author', value: `${message.author.tag} (${message.author.id})`, inline: false },
      { name: 'Channel', value: `<#${message.channel.id}>`, inline: false },
      { name: 'Content', value: message.content || 'No content (possibly an embed or attachment)', inline: false }
    )
    .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
    .setTimestamp();

  await sendLog(embed);
});

// Log message edits
client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return; // Ignore bot messages
  if (oldMessage.content === newMessage.content) return; // Ignore if content didn't change (e.g., embed updates)

  const embed = new EmbedBuilder()
    .setColor('#' + process.env.EMBEDCOLOR)
    .setTitle('Message Edited')
    .addFields(
      { name: 'Author', value: `${oldMessage.author.tag} (${oldMessage.author.id})`, inline: false },
      { name: 'Channel', value: `<#${oldMessage.channel.id}>`, inline: false },
      { name: 'Before', value: oldMessage.content || 'No content', inline: false },
      { name: 'After', value: newMessage.content || 'No content', inline: false },
      { name: 'Message Link', value: `[Jump to Message](${newMessage.url})`, inline: false }
    )
    .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
    .setTimestamp();

  await sendLog(embed);
});

// Welcome new members with embed (send to system channel)
client.on('guildMemberAdd', async guildMember => {
  const embed = new EmbedBuilder()
    .setColor('#' + process.env.EMBEDCOLOR)
    .setTitle(`Welcome to ${guildMember.guild.name}!`)
    .setDescription(`**Hello <@${guildMember.user.id}>!** We're glad you're here.`)
    .setThumbnail(guildMember.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
    .setTimestamp();

  if (guildMember.guild.systemChannel) {
    await guildMember.guild.systemChannel.send({ embeds: [embed] });
  }

  // Role assignment logic
  const devServer = process.env.DEVSERVERID;
  const plebRole = process.env.PLEBID;
  const gamingServer = process.env.GSERVERID;
  const gamerRole = process.env.GID;

  if (guildMember.guild.id === devServer) {
    const plebrole = guildMember.guild.roles.cache.find(role => role.id === plebRole);
    guildMember.roles.add(plebrole);
  }
  if (guildMember.guild.id === gamingServer) {
    const gamerrole = guildMember.guild.roles.cache.find(role => role.id === gamerRole);
    guildMember.roles.add(gamerrole);
    const roleEmbed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setDescription(`**<@${guildMember.user.id}>, your new role has been assigned!**`)
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();
    if (guildMember.guild.systemChannel) {
      await guildMember.guild.systemChannel.send({ embeds: [roleEmbed] });
    }
  }
});

// Farewell departing members with embed (send to system channel)
client.on('guildMemberRemove', async member => {
  const embed = new EmbedBuilder()
    .setColor('#' + process.env.EMBEDCOLOR)
    .setTitle(`Goodbye, ${member.user.tag}!`)
    .setDescription(`**<@${member.user.id}> has left us.** Hope you had fun!`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
    .setTimestamp();

  if (member.guild.systemChannel) {
    await member.guild.systemChannel.send({ embeds: [embed] });
  }
});

// Log emoji additions
client.on('emojiCreate', async emoji => {
  let executor = 'Unknown';
  try {
    const auditLogs = await emoji.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.EmojiCreate,
    });
    const logEntry = auditLogs.entries.first();
    if (logEntry && logEntry.target.id === emoji.id) {
      executor = logEntry.executor.tag;
    }
  } catch (error) {
    console.error('Failed to fetch audit logs for emoji create:', error);
  }

  const embed = new EmbedBuilder()
    .setColor('#' + process.env.EMBEDCOLOR)
    .setTitle('Emoji Added')
    .addFields(
      { name: 'Emoji', value: `${emoji.name} (${emoji})`, inline: false },
      { name: 'ID', value: emoji.id, inline: false },
      { name: 'Executor', value: executor, inline: false }
    )
    .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
    .setTimestamp();

  await sendLog(embed);
});

// Log emoji updates
client.on('emojiUpdate', async (oldEmoji, newEmoji) => {
  let executor = 'Unknown';
  try {
    const auditLogs = await newEmoji.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.EmojiUpdate,
    });
    const logEntry = auditLogs.entries.first();
    if (logEntry && logEntry.target.id === newEmoji.id) {
      executor = logEntry.executor.tag;
    }
  } catch (error) {
    console.error('Failed to fetch audit logs for emoji update:', error);
  }

  const embed = new EmbedBuilder()
    .setColor('#' + process.env.EMBEDCOLOR)
    .setTitle('Emoji Updated')
    .addFields(
      { name: 'Emoji', value: `${newEmoji.name} (${newEmoji})`, inline: false },
      { name: 'ID', value: newEmoji.id, inline: false },
      { name: 'Old Name', value: oldEmoji.name, inline: false },
      { name: 'New Name', value: newEmoji.name, inline: false },
      { name: 'Executor', value: executor, inline: false }
    )
    .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
    .setTimestamp();

  await sendLog(embed);
});

// Log emoji deletions
client.on('emojiDelete', async emoji => {
  let executor = 'Unknown';
  try {
    const auditLogs = await emoji.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.EmojiDelete,
    });
    const logEntry = auditLogs.entries.first();
    if (logEntry && logEntry.target.id === emoji.id) {
      executor = logEntry.executor.tag;
    }
  } catch (error) {
    console.error('Failed to fetch audit logs for emoji delete:', error);
  }

  const embed = new EmbedBuilder()
    .setColor('#' + process.env.EMBEDCOLOR)
    .setTitle('Emoji Deleted')
    .addFields(
      { name: 'Emoji Name', value: emoji.name, inline: false },
      { name: 'ID', value: emoji.id, inline: false },
      { name: 'Executor', value: executor, inline: false }
    )
    .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
    .setTimestamp();

  await sendLog(embed);
});

// Log soundboard changes using Audit Logs
client.on('guildAuditLogEntryCreate', async auditLogEntry => {
  const { action, executor, target, changes } = auditLogEntry;

  if (action !== AuditLogEvent.SoundboardUpdate) return; // Only handle soundboard changes

  const embed = new EmbedBuilder()
    .setColor('#' + process.env.EMBEDCOLOR)
    .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
    .setTimestamp();

  let soundName = target?.name || 'Unknown Sound';
  let soundId = target?.id || 'Unknown ID';

  // Determine the type of soundboard change
  if (changes.some(change => change.key === 'name' && !change.old)) {
    // Sound added
    embed.setTitle('Soundboard Sound Added')
      .addFields(
        { name: 'Sound Name', value: soundName, inline: false },
        { name: 'Sound ID', value: soundId, inline: false },
        { name: 'Executor', value: executor?.tag || 'Unknown', inline: false }
      );
  } else if (changes.some(change => change.key === 'name')) {
    // Sound updated
    const oldName = changes.find(change => change.key === 'name')?.old || 'Unknown';
    const newName = changes.find(change => change.key === 'name')?.new || 'Unknown';
    const emojiChange = changes.find(change => change.key === 'emoji');
    const volumeChange = changes.find(change => change.key === 'volume');

    embed.setTitle('Soundboard Sound Updated')
      .addFields(
        { name: 'Sound ID', value: soundId, inline: false },
        { name: 'Old Name', value: oldName, inline: false },
        { name: 'New Name', value: newName, inline: false },
        { name: 'Emoji Changed', value: emojiChange ? `${emojiChange.old || 'None'} → ${emojiChange.new || 'None'}` : 'No change', inline: false },
        { name: 'Volume Changed', value: volumeChange ? `${volumeChange.old || 'Unknown'} → ${volumeChange.new || 'Unknown'}` : 'No change', inline: false },
        { name: 'Executor', value: executor?.tag || 'Unknown', inline: false }
      );
  } else if (!target) {
    // Sound deleted (target is null in Audit Log for deletions)
    const nameChange = changes.find(change => change.key === 'name');
    soundName = nameChange?.old || 'Unknown Sound';

    embed.setTitle('Soundboard Sound Deleted')
      .addFields(
        { name: 'Sound Name', value: soundName, inline: false },
        { name: 'Executor', value: executor?.tag || 'Unknown', inline: false }
      );
  } else {
    return; // Unknown soundboard action
  }

  await sendLog(embed);
});

// Log role updates, nickname changes, server mutes, and server deafens
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  // Check for server-wide mute changes
  if (oldMember.isCommunicationDisabled() !== newMember.isCommunicationDisabled()) {
    let executor = 'Unknown';
    try {
      const auditLogs = await newMember.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberUpdate,
      });
      const logEntry = auditLogs.entries.first();
      if (logEntry && logEntry.target.id === newMember.id && logEntry.changes.some(change => change.key === 'communication_disabled_until')) {
        executor = logEntry.executor.tag;
      }
    } catch (error) {
      console.error('Failed to fetch audit logs for mute:', error);
    }

    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('Server Mute Updated')
      .addFields(
        { name: 'Member', value: `${newMember.user.tag} (${newMember.user.id})`, inline: false },
        { name: 'Muted', value: newMember.isCommunicationDisabled() ? 'Yes' : 'No', inline: false },
        { name: 'Executor', value: executor, inline: false },
        { name: 'Timeout Until', value: newMember.isCommunicationDisabled() ? newMember.communicationDisabledUntil.toISOString() : 'N/A', inline: false }
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await sendLog(embed);
  }

  // Check for server-wide deafen changes (not typically used, but included for completeness)
  if (oldMember.serverDeaf !== newMember.serverDeaf) {
    let executor = 'Unknown';
    try {
      const auditLogs = await newMember.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberUpdate,
      });
      const logEntry = auditLogs.entries.first();
      if (logEntry && logEntry.target.id === newMember.id && logEntry.changes.some(change => change.key === 'deaf')) {
        executor = logEntry.executor.tag;
      }
    } catch (error) {
      console.error('Failed to fetch audit logs for server deafen:', error);
    }

    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('Server Deafen Updated')
      .addFields(
        { name: 'Member', value: `${newMember.user.tag} (${newMember.user.id})`, inline: false },
        { name: 'Deafened', value: newMember.serverDeaf ? 'Yes' : 'No', inline: false },
        { name: 'Executor', value: executor, inline: false }
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await sendLog(embed);
  }

  // Check for role changes
  const oldRoles = oldMember.roles.cache;
  const newRoles = newMember.roles.cache;

  if (oldRoles.size !== newRoles.size || !oldRoles.every((role, id) => newRoles.has(id))) {
    const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
    const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

    // Exclude auto-assigned roles (plebRole and gamerRole) from logging
    const plebRole = process.env.PLEBID;
    const gamerRole = process.env.GID;
    const isAutoAssignedRole = addedRoles.size === 1 && (addedRoles.has(plebRole) || addedRoles.has(gamerRole));

    if (isAutoAssignedRole) return; // Skip logging for auto-assigned roles

    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('Member Roles Updated')
      .addFields(
        { name: 'Member', value: `${newMember.user.tag} (${newMember.user.id})`, inline: false },
        { name: 'Added Roles', value: addedRoles.size > 0 ? addedRoles.map(role => `<@&${role.id}>`).join(', ') : 'None', inline: false },
        { name: 'Removed Roles', value: removedRoles.size > 0 ? removedRoles.map(role => `<@&${role.id}>`).join(', ') : 'None', inline: false }
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await sendLog(embed);
  }

  // Check for nickname changes
  if (oldMember.nickname !== newMember.nickname) {
    const embed = new EmbedBuilder()
      .setColor('#' + process.env.EMBEDCOLOR)
      .setTitle('Nickname Changed')
      .addFields(
        { name: 'Member', value: `${newMember.user.tag} (${newMember.user.id})`, inline: false },
        { name: 'Old Nickname', value: oldMember.nickname || 'None', inline: false },
        { name: 'New Nickname', value: newMember.nickname || 'None', inline: false }
      )
      .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
      .setTimestamp();

    await sendLog(embed);
  }
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Error executing command!', ephemeral: true });
  }
});

// Clear guild commands on shutdown
const clearGuildCommands = async () => {
  try {
    console.log('Clearing guild commands on shutdown...');
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] });
    console.log('Successfully cleared guild commands!');
  } catch (error) {
    console.error('Failed to clear guild commands:', error);
  }
};

// Handle shutdown events
process.on('SIGINT', async () => {
  await clearGuildCommands();
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await clearGuildCommands();
  client.destroy();
  process.exit(0);
});

// Login
client.login(process.env.TOKEN);