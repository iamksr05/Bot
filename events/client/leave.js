const Discord = require("discord.js");

module.exports = (client) => {

    let leaveChannel = '840134723858726912';

    client.on('guildMemberRemove', async (member) => {
        if (member.guild.id == '783217517455605810') {
            const user = member.user;
            const server = member.guild;

            const canvacord = require("canvacord");
            const leaver = new canvacord.Leaver()
                .setUsername(user.username)
                .setDiscriminator(user.discriminator || "0000")
                .setMemberCount(server.memberCount)
                .setGuildName(server.name)
                .setAvatar(user.displayAvatarURL({ format: "png", dynamic: true }))
                .setColor("border", "#8015EA")
                .setColor("username-box", "#8015EA")
                .setColor("discriminator-box", "#8015EA")
                .setColor("message-box", "#8015EA")
                .setColor("title", "#8015EA")
                .setColor("avatar", "#ffffff")
                .setBackground("https://i.ytimg.com/vi/HlMESVM7Lf0/maxresdefault.jpg");

            const buffer = await leaver.build();
            const attachment = new Discord.MessageAttachment(buffer, "goodbye-image.png");
            const channel = member.guild.channels.cache.get(leaveChannel);
            
            if (channel) channel.send(attachment);
            user.send(attachment).catch(() => {});
        } else {
            return;
        }

    })
}