

module.exports = {
    name: 'guildCreate',
    /**
     * @param {Discord.Interaction} interaction 
     */
    async execute(guild, client) {
        let channelId=process.env.LOGS
        let channel = client.channels.cache.get(channelId)
        console.log(channel)
        if(channel){
            console.log(`Nouveau serveur: ${guild.name}`)
            channel.send(`Nouveau serveur: ${guild.name}`)
        }
    },
}