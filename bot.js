require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActivityType, AuditLogEvent, PermissionFlagsBits } = require('discord.js');
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
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessageReactions, // Required for reaction events
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

// Bot ready event
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Set presence (rotating status)
  const nameArray = ['with your mom', '/help', 'new slash cmds', 'catgirls'];
  const typeArray = [
    ActivityType.Playing,
    ActivityType.Listening,
    ActivityType.Listening,
    ActivityType.Watching,
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

  // Load self-role data and set up reaction collector
  try {
    const selfRoleData = JSON.parse(fs.readFileSync('./selfrole.json', 'utf8'));
    const { messageId, roleId, channelId } = selfRoleData;
    const channel = client.channels.cache.get(channelId);
    if (channel) {
      const message = await channel.messages.fetch(messageId);
      if (message) {
        // Handle reaction adds
        client.on('messageReactionAdd', async (reaction, user) => {
          if (reaction.message.id !== messageId || user.bot) return;
          if (reaction.emoji.name !== '✅') return;

          const guild = reaction.message.guild;
          const member = await guild.members.fetch(user.id);
          const role = guild.roles.cache.get(roleId);

          if (!role) {
            console.error(`Self-role (${roleId}) not found!`);
            return;
          }

          try {
            await member.roles.add(role);
            const logEmbed = new EmbedBuilder()
              .setColor('#' + process.env.EMBEDCOLOR)
              .setTitle('Self-Role Assigned')
              .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.user.id})`, inline: false },
                { name: 'Role', value: `<@&${role.id}>`, inline: false },
                { name: 'Action', value: 'Assigned via reaction', inline: false }
              )
              .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
              .setTimestamp();
            await sendLog(logEmbed);
          } catch (error) {
            console.error(`Failed to assign self-role to ${member.user.tag}:`, error);
          }
        });

        // Handle reaction removes
        client.on('messageReactionRemove', async (reaction, user) => {
          if (reaction.message.id !== messageId || user.bot) return;
          if (reaction.emoji.name !== '✅') return;

          const guild = reaction.message.guild;
          const member = await guild.members.fetch(user.id);
          const role = guild.roles.cache.get(roleId);

          if (!role) {
            console.error(`Self-role (${roleId}) not found!`);
            return;
          }

          try {
            await member.roles.remove(role);
            const logEmbed = new EmbedBuilder()
              .setColor('#' + process.env.EMBEDCOLOR)
              .setTitle('Self-Role Removed')
              .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.user.id})`, inline: false },
                { name: 'Role', value: `<@&${role.id}>`, inline: false },
                { name: 'Action', value: 'Removed via reaction', inline: false }
              )
              .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
              .setTimestamp();
            await sendLog(logEmbed);
          } catch (error) {
            console.error(`Failed to remove self-role from ${member.user.tag}:`, error);
          }
        });
      }
    }
  } catch (error) {
    console.error('Failed to load self-role data:', error);
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const messageContent = message.content.toLowerCase();

  // Name-to-emoji mapping
  const nameToEmojiMap = {
    'rat': '<:Rat:1349066449834217542>',
    'myš': '<:Rat:1349066449834217542>',
    'mouse': '<:Rat:1349066449834217542>',
    'krys': '<:Rat:1349066449834217542>',
    'smols': '<:Smols:1349100605033025687>',
    'žmols': '<:Smols:1349100605033025687>',
    'stanley': '<:Stanley:1349103941878681620>',
    'stanlík': '<:Stanley:1349103941878681620>',
    'smoldix': '<:Smoldixa:1349103905040236706>',
    'umbra': '<:Umbra:1349103877739385003>',
    'umbřík': '<:Umbra:1349103877739385003>',
    'kofi': '<:Kofik:1349103850878931005>',
    'kofík': '<:Kofik:1349103850878931005>',
    'verk': '<:Verk:1349103798190346271>',
    'lahvi': '<:Lahvik:1349103785880060057>',
    'lahvík': '<:Lahvik:1349103785880060057>',
    'eda': '<:Eda:1349103425312522321>',
    'edík': '<:Eda:1349103425312522321>',
    'bobinka': '<:Bobinka:1349103208751956029>',
    'dix': '<:Dixa:1349103200275533898>',
  };

  // Check for names in the message content and react with corresponding emoji
  for (const [name, emoji] of Object.entries(nameToEmojiMap)) {
    if (messageContent.includes(name)) {
      try {
        await message.react(emoji);
      } catch (error) {
        console.error(`Failed to react with ${name} emoji:`, error);
      }
    }
  }
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
    .setTitle(`<a:welcome1:1349072814820556800><a:welcome2:1349072792951328888> to ${guildMember.guild.name}!`)
    .setDescription(`**Hello <@${guildMember.user.id}>!** We're glad you're here.`)
    .setThumbnail(guildMember.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
    .setTimestamp();

  if (guildMember.guild.systemChannel) {
    await guildMember.guild.systemChannel.send({ embeds: [embed] });
  }

  // Role assignment logic
  const guildId = process.env.GUILD_ID;
  const plebRole = process.env.PLEBID;
  const gamerRole = process.env.AUTOROLE;

  console.log(`Member joined guild: ${guildMember.guild.id}`);

  // Fetch the member to ensure they’re in the cache
  const member = await guildMember.guild.members.fetch(guildMember.id);

  // Check bot permissions
  if (!guildMember.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
    console.error(`Bot lacks ManageRoles permission in guild ${guildMember.guild.id}`);
    return;
  }

  if (guildMember.guild.id === guildId) {
    const plebrole = guildMember.guild.roles.cache.find(role => role.id === plebRole);
    if (plebrole) {
      const botHighestRole = guildMember.guild.members.me.roles.highest;
      if (botHighestRole.position <= plebrole.position) {
        console.error(`Bot's highest role (${botHighestRole.name}) is not higher than pleb role (${plebrole.name})`);
      } else {
        try {
          await member.roles.add(plebrole);
        } catch (error) {
          console.error(`Failed to assign pleb role to ${member.user.tag}:`, error);
        }
      }
    } else {
      console.error(`Pleb role (${plebRole}) not found in guild ${guildMember.guild.id}`);
    }

    const gamerrole = guildMember.guild.roles.cache.find(role => role.id === gamerRole);
    if (gamerrole) {
      const botHighestRole = guildMember.guild.members.me.roles.highest;
      if (botHighestRole.position <= gamerrole.position) {
        console.error(`Bot's highest role (${botHighestRole.name}) is not higher than gamer role (${gamerrole.name})`);
      } else {
        try {
          await member.roles.add(gamerrole);
          const roleEmbed = new EmbedBuilder()
            .setColor('#' + process.env.EMBEDCOLOR)
            .setDescription(`**<@${member.user.id}>, your new role has been assigned!**`)
            .setFooter({ text: 'Unlucky bot | Made by unlucky.life' })
            .setTimestamp();
          if (guildMember.guild.systemChannel) {
            await guildMember.guild.systemChannel.send({ embeds: [roleEmbed] });
          }
        } catch (error) {
          console.error(`Failed to assign gamer role to ${member.user.tag}:`, error);
        }
      }
    } else {
      console.error(`Gamer role (${gamerRole}) not found in guild ${guildMember.guild.id}`);
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
    const gamerRole = process.env.AUTOROLE;
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

// Handle shutdown events
process.on('SIGINT', async () => {
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  client.destroy();
  process.exit(0);
});

// Login
client.login(process.env.TOKEN);