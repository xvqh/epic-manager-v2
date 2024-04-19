const Discord = require("discord.js")
const ms = require("ms")
const CreateBot = require("../../../Libs/Function/CreateBot")
const { Bots } = require("../../../Database/Models/Bots");
const isBotTokenValid = require("../../../Libs/Function/isBotTokenValid");
const generateEmbed = require("../../../Libs/Function/generateEmbed");
const EditBot = require("../../../Libs/Function/EditBot");
module.exports = {

    name: "addbot",
    description: "Créer un bot perso",
    ownerOnly: false,
    AdminOnly: true,
    userPerms: ["SendMessages"],
    botPerms: ["SendMessages"],
    options: [
        {
            name: "token",
            description: "Token du bot.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "owner",
            description: "Owner du bot.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "type",
            description: "Type du bot à créer.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
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
            required: true,
        },
        {
            name: "duration",
            description: "Durée du bot (example: 30d).",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    async execute(interaction, client) {
        const token = interaction.options.getString("token")
        const owner = interaction.options.getUser("owner").id
        const type = interaction.options.getString("type")
        const max_guild = interaction.options.getNumber("max_guild") || 10
        let duration = interaction.options.getString("duration") || "30d"
        const bots = await Bots.findAll()

        try {
            duration = ms(duration)
        } catch (err) {
            return interaction.reply({ content: `:x: ${err} !`, ephemeral: true })
        }

        if ((owner).length > 20) return interaction.reply({ content: `:x: Format de l'ID invalide !`, ephemeral: true })
        try {
            await client.users.fetch(owner)
        } catch (err) {
            return interaction.reply({ content: `:x: ID de l'owner invalide: \n\`${err}\``, ephemeral: true })
        }

        if (max_guild < 1) return interaction.reply({ content: `:x: Le nombre de serveur doit être supérieur à 1 !`, ephemeral: true })
        if (!duration) return interaction.reply({ content: ":x: Durée invalide, elle doit être dans le format \`30d\` !", ephemeral: true });
        let tokenCheck = await isBotTokenValid(token)
        if (tokenCheck == false) return interaction.reply({ content: `:x: Le token est invalide, ou vérifiez les intents !`, ephemeral: true })
        let prefix = "&"
        if (type == "gestion") prefix = "."
        const botsArray = bots.map(bot => bot.token);

        const button = new Discord.ButtonBuilder()
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${tokenCheck}&permissions=8&scope=bot%20applications.commands`)
            .setLabel('Ajouter le bot')
            .setStyle(Discord.ButtonStyle.Link);
        const row = new Discord.ActionRowBuilder()
            .addComponents(button);

        if (botsArray.includes(token)) {
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
                updatedFields.Duration = duration;
            }

            await EditBot(interaction, bot.token, updatedFields);
            return generateEmbed(interaction, null, [row], null, {
                title: "Le bot a bien été modifié !", description: `Merci de ton achat <@${owner}> (\`${owner}\`) ! Le bot est prêt à être réutilisé !
Voici son lien d'invitation https://discord.com/api/oauth2/authorize?client_id=${tokenCheck}&permissions=8&scope=bot%20applications.commands
Il expirera <t:${Date.parse(new Date(Date.now() + duration)) / 1000}:R>`
            })
        } else {

            CreateBot(token, prefix, owner, max_guild.toString(), type, duration)
            generateEmbed(interaction, null, [row], null, {
                title: "Le bot a bien été créé !", description: `Merci de ton achat <@${owner}> (\`${owner}\`) !
Le bot est prêt à être utilisé !
Voici son lien d'invitation https://discord.com/api/oauth2/authorize?client_id=${tokenCheck}&permissions=8&scope=bot%20applications.commands
Il expirera: <t:${Date.parse(new Date(Date.now() + duration)) / 1000}:R>`
            })
        }

        //LOGS
        let embed = await generateEmbed(interaction, null, [], true, {
            title: `${botsArray.includes(token) ? "Un bot vient d'être modifié" : "Un bot vient d'être créé"}`, description: `**Modérateur:** \`${interaction.user.username}\`
**Identifiant:** \`${tokenCheck}\`
**Il expirera** <t:${Date.parse(new Date(Date.now() + duration)) / 1000}:R>`
        })
        let channel = client.channels.cache.get(process.env.LOGS)
        if (channel) {
            channel.send({ embeds: [embed] }).catch(e => { console.log(e) })
        }

    }
}
//(token, defaultPrefix, owner, maxGuild, type, duration)