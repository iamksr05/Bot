// module.exports = {
//     name: 'nickname',
//     aliases: ['nn'],
//     permissions: ["MANAGE_NICKNAMES"],
//     cooldown: 0,
//     description: "This command sets nickname",
//     async execute(message, args, cmd, client, Discord) {
//         let { member } = message;
//         if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) return message.channel.send("I require \`MANAGE_NICKNAMES\` Permissions to use \`!nickname\` command!");
//         const third = args.slice(5).join(" ");
//         if (third) return message.channel.send('This name is too long.');


//         const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
//         const nickName = args.slice(1).join(" ");
//         const lastName = mentionedMember.user.username;

//         if (!args[0]) return message.channel.send('You must specify a member to change nickname.\nCommand Format: \`!nickname @user [nickname]\`');
//         if (!mentionedMember) return message.channel.send('The member mentioned is not in the server.');
//         if (!nickName) return message.channel.send('You must state a nickname for the member');
//         if (mentionedMember.user.id == '747042752415531021') return message.channel.send('You cannot change my developer\'s nickname.');
//         if (mentionedMember.user.id == message.guild.owner.user.id) return message.channel.send(`You cannot change the Owner's nickname`);
//         if (mentionedMember.user.id == '827874200394924082' && message.author.id !== message.guild.owner.user.id) return message.channel.send('You cannot change my nickname.');

//         const embed = new Discord.MessageEmbed()
//         .setColor('#87727F')
//         .setDescription(`Nickname Successfully changed form **${lastName}** to ${mentionedMember}!`);

//         await mentionedMember.setNickname(nickName).then(message.channel.send(embed)).catch(err => console.log(err) && message.channel.send('There was an error in changing that member\'s nickname'));

//     }
// }





module.exports = {
    name: 'nickname',
    aliases: ['nn'],
    permissions: ["MANAGE_NICKNAMES"],
    cooldown: 0,
    description: "This command sets nickname",

    async execute(message, args, cmd, client, Discord) {
        const { member } = message;
        

        if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) return message.channel.send("I require `MANAGE_NICKNAMES` permission to use this command!");

        if (!args[0]) return message.channel.send('You must specify a member.\nFormat: `!nickname @user [nickname]`');
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!mentionedMember) return message.channel.send('The member is not in the server.');
        if (mentionedMember.user.id === '747042752415531021' && message.author.id !== '747042752415531021') return message.channel.send("You cannot change my developer's nickname.");
        // if (message.author.id !== '747042752415531021' && mentionedMember.user.id === message.guild.ownerID) return message.channel.send("You cannot change the server owner's nickname.");
        if (mentionedMember.user.id === '827874200394924082' && message.author.id !== message.guild.ownerID) return message.channel.send('You cannot change my nickname.');

        const nickName = args.slice(1).join(" ");
        if (!nickName) return message.channel.send('You must provide a nickname.');
        if (nickName.length > 32) return message.channel.send('Nickname is too long.');
        const lastName = mentionedMember.user.username;

        const embed = new Discord.MessageEmbed()
            .setColor('#87727F')
            .setDescription(
                `Nickname successfully changed from **${lastName}** to **${nickName}**`
            );

        try {
            await mentionedMember.setNickname(nickName);
            message.channel.send(embed);

        } catch (err) {
            console.log(err);
            member.guild.channels.cache.get('835486658552004608').send(err);
            console.log(message);
            message.channel.send("There was an error changing that member's nickname.");

        }
    }
}