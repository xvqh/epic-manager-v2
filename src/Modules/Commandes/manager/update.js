const Discord = require("discord.js")
const { Bots } = require("../../../Database/Models/Bots");
module.exports = {

    name: "update",
    description: "Met à jour un bot bot.",
    ownerOnly: false,
    AdminOnly: false,
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

        // Vérifier si c'est le bot du membre ou si le membre est owner
        if ((bot && bot.owner == interaction.member.id) || (bot && process.env.OWNERS.includes(interaction.member.id))) {

            await Bots.update(
                { Status: 5 },
                { where: { botid: id }, returning: true }
            );
            interaction.reply({ content: `<:icons_clouddown:1068874792045916291> Mise à jour de <@${id}> en cours...`, ephemeral: false })
            setTimeout(async () => {
                await Bots.update(
                    { Status: null },
                    { where: { botid: id }, returning: true }
                );
                interaction.editReply({ content: `<:icons_online:1068874834236420096> La mise à jour de <@${id}> est terminée !\nVotre bot redémarre !`, ephemeral: false })
            }, 9000)

        } else return interaction.reply({ content: `:x: Vous n'avez aucun bot avec cet identifiant.`, ephemeral: true })
    }
}