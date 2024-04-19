const Discord = require("discord.js")
const { parseHuman } = require("human-ms");
const ms = require("ms")
const CreateBot = require("../../../Libs/Function/CreateBot")
const { Bots } = require("../../../Database/Models/Bots");
const isBotTokenValid = require("../../../Libs/Function/isBotTokenValid");
const generateEmbed = require("../../../Libs/Function/generateEmbed");
module.exports = {

    name: "delbot",
    description: "Supprime un bot perso.",
    ownerOnly: false,
    AdminOnly: true,
    userPerms: ["SendMessages"],
    botPerms: ["SendMessages"],
    options: [
        {
            name: "identifiant",
            description: "Identifiant du bot que vous souhaitez supprimer.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute(interaction, client) {
        const id = interaction.options.getString("identifiant")

        const bot = await Bots.findOne({
            where: {
                botid: id
            }
        });
        if(!bot) return interaction.reply({content: ":x: Je ne trouve pas de bot avec cet identifiant", ephemeral :true})
        let botUser = await client.users.fetch(id)
        await Bots.destroy({
            where: {
              botid: id
            }
          });
        generateEmbed(interaction, null, [], null, {
            title: "Le bot a bien été supprimé !", description: `Le bot personnalisé [\`${botUser.username}\`](https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=8&scope=bot%20applications.commands) a bien été supprimé !`
        })
    }
}