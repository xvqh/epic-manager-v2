
const { Op } = require('sequelize');
const { Bots } = require('../../../Database/Models/Bots');
const generateEmbed = require('../../../Libs/Function/generateEmbed');

module.exports = {

    name: "stats",
    description: "Affiche les statistiques",
    ownerOnly: false,
    AdminOnly: true,
    userPerms: ["SendMessages"],
    botPerms: ["SendMessages"],

    async execute(interaction, client) {
        const onlineBotCount = await Bots.count({
            where: {
                [Op.or]: [
                    { Status: 0 },
                    { Status: { [Op.is]: null } }
                ]
            }
        });

        const offlineBots = await Bots.count({
            where: { Status: '5' }
        });
        const invalidTokens = await Bots.count({
            where: { Status: '1' }
        })
        const expiredBots = await Bots.count({
            where: { Status: '2' }
        })
        const ErroredBots = await Bots.count({
            where: { Status: '3' }
        })

        generateEmbed(interaction, null, [], null, {
            title: "Statistiques: ", description: `Bots en ligne: ${onlineBotCount}\nBots hors ligne: ${offlineBots}\n\n> **Erreurs:**\nToken invalides: ${invalidTokens}\nBots expirés: ${expiredBots}\nAutres erreurs: ${ErroredBots}`
        })
    },
};