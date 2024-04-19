const Discord = require("discord.js")
const { Bots } = require("../../../Database/Models/Bots");
const generateEmbed = require("../../../Libs/Function/generateEmbed");
const isBotTokenValid = require("../../../Libs/Function/isBotTokenValid");
module.exports = {

    name: "manage",
    description: "Permet de contrôler vos bots",
    ownerOnly: false,
    AdminOnly: false,
    userPerms: ["SendMessages"],
    botPerms: ["SendMessages"],
    options: [
        {
            type: Discord.ApplicationCommandOptionType.Subcommand,
            name: "edit-token",
            description: "Modifie le token d'un bot",
            options: [
                {
                    name: "identifiant",
                    description: "Identifiant du bot que vous souhaitez contrôler.",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "token",
                    description: "Nouveau token du bot.",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                }
            ],
        },
        {
            type: Discord.ApplicationCommandOptionType.Subcommand,
            name: "edit-status",
            description: "Allume/redémarre ou arrête le bot",
            options: [
                {
                    name: "identifiant",
                    description: "Identifiant du bot que vous souhaitez contrôler.",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "status",
                    description: "Nouveau status du bot.",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'Allumer', value: '0' },
                        { name: 'Eteindre', value: '5' },
                        { name: 'Redémarrer', value: '55' },
                    ]
                }
            ],
        }
    ],

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const id = interaction.options.getString("identifiant")
        const token = interaction.options.getString("token")

        const bot = await Bots.findOne({
            where: {
                botid: id
            }
        });

        if ((bot && bot.owner == interaction.member.id) || (bot && process.env.OWNERS.includes(interaction.member.id))) {
            switch (subcommand) {
                case 'edit-token':
                    let tokenCheck = await isBotTokenValid(token)
                    if (tokenCheck == false) return interaction.reply({ content: `:x: Le token est invalide, ou vérifiez les intents !`, ephemeral: true })

                    await Bots.update(
                        { token: token,
                        Status: null },
                        { where: { botid: id }, returning: true }
                    );
                    interaction.reply({ content: `<:icons_key:1068874826351124520> Le token a été modifié avec succès, <@${tokenCheck}> est en ligne !\nFaites \`/mybot\` pour avoir son lien d'invitation`, ephemeral: true })
                    break;


                case 'edit-status':
                    const status = interaction.options.getString("status")
                    await Bots.update(
                        { Status: status.replace("55", "5") },
                        { where: { botid: id }, returning: true }
                    );
                    if (status == "55") {
                        interaction.reply({ content: `<:icons_key:1068874826351124520> Le redémarrage de <@${id}> va prendre une dizaine de secondes !\nFaites \`/mybot\` pour avoir son lien d'invitation`, ephemeral: false })
                        setTimeout(async () => {
                            await Bots.update(
                                { Status: null },
                                { where: { botid: id }, returning: true }
                            );
                        }, 10000)
                    }
                    if (status == "0") {
                        if (!bot.Status || bot.Status == "0") return interaction.reply(":eyes: Il semblerait que votre bot est déjà en ligne !")
                        interaction.reply({ content: `<:icons_key:1068874826351124520> Le démarrage de <@${id}> va prendre une dizaine de secondes !\nFaites \`/mybot\` pour avoir son lien d'invitation`, ephemeral: false })
                    }
                    if (status == "5") {
                        if (bot.Status == "5") return interaction.reply(":eyes: Il semblerait que votre bot est déjà hors-ligne !")
                        interaction.reply({ content: `<:icons_key:1068874826351124520> L'arrêt de <@${id}> va prendre une dizaine de secondes !`, ephemeral: false })
                    }
                    break;


                    break;
            }
        } else return interaction.reply({ content: `:x: Vous n'avez aucun bot avec cet identifiant.`, ephemeral: true })

    }
}