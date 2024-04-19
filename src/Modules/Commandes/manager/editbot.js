const Discord = require("discord.js")
const ms = require("ms")
const { Bots } = require("../../../Database/Models/Bots");
const EditBot = require("../../../Libs/Function/EditBot");
module.exports = {

    name: "editbot",
    description: "Créer un bot perso",
    ownerOnly: false,
    AdminOnly: true,
    userPerms: ["SendMessages"],
    botPerms: ["SendMessages"],
    options: [
        {
            name: "id",
            description: "Identifiant du bot.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "owner",
            description: "Owner du bot.",
            type: Discord.ApplicationCommandOptionType.User,
            required: false,
        },
        {
            name: "type",
            description: "Type du bot à créer.",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
            choices: [
                { name: 'CoinsBot Personnalisable', value: 'coins' },
                { name: 'CoinsBot Personnalisable V3', value: 'coinsv3' },
                { name: 'E-Gestion Personnalisable', value: 'gestion' },
            ]
        },
        {
            name: "max_guild",
            description: "Nombre de serveurs maximum (coins: 4 | gestion: 20).",
            type: Discord.ApplicationCommandOptionType.Number,
            required: false,
        },
        {
            name: "duration",
            description: "Durée du bot (example: 30d).",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    async execute(interaction, client) {
        const id = interaction.options.getString("id");
        const owner = interaction.options.getUser("owner");
        const type = interaction.options.getString("type");
        const max_guild = interaction.options.getNumber("max_guild");
        let duration = interaction.options.getString("duration");

        if (duration && !ms(duration)) return interaction.reply({ content: ":x: Durée invalide, elle doit être dans le format \`30d\` !", ephemeral: true });
        const bot = await Bots.findOne({
            where: {
                botid: id
            }
        });
        if (!bot) return interaction.reply({ content: ":x: Je ne trouve pas de bot avec cet identifiant", ephemeral: true });

        const updatedFields = {};
        if (owner) {
            updatedFields.owner = owner.id;
        }
        if (type) {
            updatedFields.type = type;
        }
        if (max_guild) {
            updatedFields.max_guild = max_guild;
        }
        if (duration) {
            updatedFields.Duration = ms(duration);
            updatedFields.DateStart = Date.now()
        }

        await EditBot(interaction, bot.token, updatedFields);

        // Envoyer une réponse à l'interaction indiquant que le bot a été modifié avec succès
        await interaction.reply({ content: "<:icons_key:1068874826351124520> Le bot a été modifié avec succès.", ephemeral: true });

    }
}
//(token, defaultPrefix, owner, maxGuild, type, duration)