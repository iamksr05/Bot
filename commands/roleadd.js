module.exports = {
    name: 'giverole',
    aliases: ['gr', 'addrole'],
    permissions: ["MANAGE_ROLES"],
    cooldown: 0,
    description: "Give a role to a member",

    async execute(message, args, cmd, client, Discord) {

        if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
            return message.channel.send(
                'I require `MANAGE_ROLES` permission to manage roles.'
            );
        }

        if (!args[0]) {
            return message.channel.send(
                'Usage: `!giverole @user role name / role id / @role`'
            );
        }

        const mentionedMember =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!mentionedMember) {
            return message.channel.send('That member was not found in this server.');
        }

        const roleQuery = args.slice(1).join(' ');

        if (!roleQuery) {
            return message.channel.send(
                'Please provide a role name, role ID, or mention a role.'
            );
        }

        const role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(roleQuery) ||
            message.guild.roles.cache.find(
                r => r.name.toLowerCase() === roleQuery.toLowerCase()
            );

        if (!role) {
            return message.channel.send('That role does not exist.');
        }

        // User hierarchy check
        if (
            message.author.id !== message.guild.ownerID &&
            message.member.roles.highest.position <= mentionedMember.roles.highest.position
        ) {
            return message.channel.send(
                'You cannot manage this member because their highest role is equal to or higher than yours.'
            );
        }

        // User assigning role above themselves
        if (
            message.author.id !== message.guild.ownerID &&
            message.member.roles.highest.position <= role.position
        ) {
            return message.channel.send(
                'You cannot assign a role equal to or higher than your highest role.'
            );
        }

        // Bot hierarchy check
        if (role.position >= message.guild.me.roles.highest.position) {
            return message.channel.send(
                'My highest role must be above the role you are trying to assign.'
            );
        }

        // Prevent duplicate role
        if (mentionedMember.roles.cache.has(role.id)) {
            return message.channel.send(
                `${mentionedMember.user.username} already has that role.`
            );
        }

        try {
            await mentionedMember.roles.add(role);

            message.channel.send(
                `Successfully gave **${role.name}** to ${mentionedMember}.`
            );

        } catch (err) {
            console.log(err);
            message.channel.send(
                'There was an error while assigning the role.'
            );
        }
    }
}