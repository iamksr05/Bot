module.exports = async (client) =>{
    const guild = client.guilds.cache.get('783217517455605810');
    setInterval(() =>{
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get('834454503724941332');
        if (channel) {
            channel.setName(`Total Members - ${memberCount.toLocaleString()}`).catch(console.error);
        }
     }, 300000); // 5 minutes
}
