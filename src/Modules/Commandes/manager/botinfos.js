const Discord = require("discord.js")
const { parseHuman } = require("human-ms");
const ms = require("ms")
const CreateBot = require("../../../Libs/Function/CreateBot")
const { Bots } = require("../../../Database/Models/Bots");
const isBotTokenValid = require("../../../Libs/Function/isBotTokenValid");
const generateEmbed = require("../../../Libs/Function/generateEmbed");
const StatusInterpretor = require("../../../Libs/Function/StatusInterpretor");
module.exports = {

    name: "botinfos",
    description: "Affiche les informations d'un bot.",
    ownerOnly: false,
    AdminOnly: true,
    userPerms: ["SendMessages"],
    botPerms: ["SendMessages"],
    options: [
        {
            name: "identifiant",
            description: "Identifiant du bot que vous souhaitez consulter.",
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

		const button = new Discord.ButtonBuilder()
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=8&scope=bot%20applications.commands`)
			.setLabel('Ajouter le bot')
			.setStyle(Discord.ButtonStyle.Link);
		const row = new Discord.ActionRowBuilder()
			.addComponents(button);

        const botUser = await client.users.fetch(bot.botid);
        const botOwner = await client.users.fetch(bot.owner);
        generateEmbed(interaction, null, [row], null, {
            title: "Voici les informations du bot", description: `• [\`${botUser.tag}\`](https://discord.com/api/oauth2/authorize?client_id=${bot.botid}&permissions=8&scope=bot%20applications.commands) (${bot.type}) : <t:${Math.floor((new Date(bot.DateStart).getTime() + parseInt(bot.Duration)) / 1000)}:R>\n┖ ${await StatusInterpretor(bot.dataValues.Status)}\n┖ Propriétaire du bot: [\`${botOwner.username}\`](https://discord.com/channels/@me/${bot.owner})`
        })
    }
}