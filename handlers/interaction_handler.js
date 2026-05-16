const axios = require('axios');
const messageEvent = require('../events/guild/message.js');

module.exports = (client, Discord) => {
    client.ws.on('INTERACTION_CREATE', async interaction => {
        // Only handle slash commands
        if (interaction.type !== 2) return;

        const cmdName = interaction.data.name;
        const command = client.commands.get(cmdName);
        if (!command) return;

        // Immediately acknowledge the interaction (DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)
        try {
            await axios.post(`https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`, {
                type: 5
            });
        } catch (e) {
            console.error('Error deferring interaction:', e);
            return;
        }

        const argsString = (interaction.data.options && interaction.data.options.length > 0) ? interaction.data.options[0].value : '';
        const prefix = process.env.PREFIX || '!';
        const mockContent = `${prefix}${cmdName} ${argsString}`.trim();

        // Get guild, channel, author
        const guild = client.guilds.cache.get(interaction.guild_id);
        if (!guild) return;
        const channel = guild.channels.cache.get(interaction.channel_id);
        const member = await guild.members.fetch(interaction.member.user.id);
        const author = member.user;

        let replied = false;
        
        // Save the original send method
        const originalSend = channel.send.bind(channel);

        // We mock the channel.send method
        const mockChannel = Object.create(channel);
        mockChannel.send = async (...args) => {
            if (!replied) {
                replied = true;
                let payload = {};
                const content = args[0];
                const options = args[1];

                if (typeof content === 'string') {
                    payload.content = content;
                    if (options && options.embed) payload.embeds = [options.embed.toJSON ? options.embed.toJSON() : options.embed];
                } else if (content && content.embed) {
                    payload.embeds = [content.embed.toJSON ? content.embed.toJSON() : content.embed];
                } else if (content instanceof Discord.MessageEmbed) {
                    payload.embeds = [content.toJSON()];
                }

                try {
                    const res = await axios.patch(`https://discord.com/api/v10/webhooks/${client.user.id}/${interaction.token}/messages/@original`, payload);
                    return await channel.messages.fetch(res.data.id);
                } catch (e) {
                    console.error('Error editing interaction response:', e.response ? e.response.data : e.message);
                    return await originalSend(...args);
                }
            } else {
                return await originalSend(...args);
            }
        };

        const mockMentions = {
            users: new Discord.Collection(),
            members: new Discord.Collection(),
            roles: new Discord.Collection(),
            channels: new Discord.Collection(),
            crosspostedChannels: new Discord.Collection(),
            repliedUser: null,
            everyone: false
        };

        const mentionMatch = argsString.match(/<@!?(\d+)>/g);
        if (mentionMatch) {
            for (const match of mentionMatch) {
                const id = match.replace(/<@!?/g, '').replace('>', '');
                try {
                    const u = await client.users.fetch(id);
                    if (u) mockMentions.users.set(id, u);
                    const m = await guild.members.fetch(id);
                    if (m) mockMentions.members.set(id, m);
                } catch (e) {}
            }
        }

        const mockMessage = {
            id: interaction.id,
            content: mockContent,
            author: author,
            member: member,
            guild: guild,
            channel: mockChannel,
            client: client,
            mentions: mockMentions,
            createdTimestamp: Date.now(),
            reply: async (...args) => {
                const content = args[0];
                const newContent = typeof content === 'string' ? `<@${author.id}> ${content}` : content;
                return await mockChannel.send(newContent, args[1]);
            }
        };

        // Execute the native message event using the mock message
        try {
            await messageEvent(Discord, client, mockMessage);
        } catch (e) {
            console.error('Error in mock message event:', e);
            mockChannel.send('There was an error executing this command!');
        }
    });
};
