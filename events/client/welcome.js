const Discord = require("discord.js");

module.exports = (client) => {
    let welcomeChannel = '840600796088631316'

    client.on('guildMemberAdd', async (member) => {
        if (member.guild.id === '783217517455605810' || '864021290578346035') {

            const user = member.user;

            const canvacord = require("canvacord");
            const welcomer = new canvacord.Welcomer()
                .setUsername(user.username)
                .setDiscriminator(user.discriminator || "0000")
                .setMemberCount(member.guild.memberCount)
                .setGuildName(member.guild.name)
                .setAvatar(user.displayAvatarURL({ format: "png", dynamic: true }))
                .setColor("border", "#FB7746")
                .setColor("username-box", "#EEB677")
                .setColor("discriminator-box", "#888582")
                .setColor("message-box", "#74EB5B")
                .setColor("title", "#F19D45")
                .setColor("avatar", "#FFFFFF")
                .setBackground("https://wallpapercave.com/wp/wp7044480.jpg");

            const buffer = await welcomer.build();
            const attachment = new Discord.MessageAttachment(buffer, "welcome-image.png");
            const channel = member.guild.channels.cache.get(welcomeChannel);

            if (channel) channel.send(attachment);
            user.send(attachment).catch(() => {});

        } else {
            return;
        }

    })
}