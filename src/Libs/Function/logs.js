const generateEmbed = require("./generateEmbed")

module.exports = async (interaction, text, title) => {
    let embed = await generateEmbed(interaction, null, [], true, {
        title: title, description: text})
    let channel = interaction.client.channels.cache.get(process.env.LOGS)
    if (channel) {
        channel.send({ embeds: [embed] }).catch(e => { console.log(e) })

    }
}