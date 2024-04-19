const Discord = require("discord.js")
const { Bots } = require("../../../Database/Models/Bots");
const adminCheck = require("../../../Libs/Function/adminCheck");
const StatusInterpretor = require("../../../Libs/Function/StatusInterpretor");
module.exports = {

    name: "mybot",
    description: "Affiche vos bots (v2 only)",
    ownerOnly: false,
    AdminOnly: false,
    userPerms: ["SendMessages"],
    botPerms: ["SendMessages"],
    options: [
        {
            name: "user",
            description: "Voir les bots du membre (admin only).",
            type: Discord.ApplicationCommandOptionType.User,
            required: false,
        }
    ],
    async execute(interaction, client) {
        let user = interaction.options.getUser("user") || interaction.user
        if (!adminCheck(interaction)) user = interaction.user
        const ownerBots = await Bots.findAll({
            where: {
                owner: user.id
            }
        });
        let dba = ownerBots.map(i => i).filter(i => i.botid !== null)
        if (!dba || dba.length < 1) {
            if(user.id == interaction.member.id)  { return interaction.reply(":x: Vous n'avez aucun bot"); } else return interaction.reply(`:x: ${user.username} n'a aucun bot`);
        }

        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `Bot${dba.length > 1 ? "s" : ""} de ${user.username}`, iconURL: "https://media.discordapp.net/attachments/1002173915549937714/1076559635563167895/Illustration_sans_titre.png?width=676&height=676" })
            .setDescription(`${(await Promise.all(dba.map(async (user) => {
                const botUser = await client.users.fetch(user.botid);
                return `- [\`${botUser.tag}\`](https://discord.com/api/oauth2/authorize?client_id=${user.botid}&permissions=8&scope=bot%20applications.commands) (${user.type}) : <t:${Math.floor((new Date(user.DateStart).getTime() + parseInt(user.Duration)) / 1000)}:R>\n┖ ${await StatusInterpretor(user.dataValues.Status)}`;
            }))).join("\n")}`)
            .setImage("https://cdn.discordapp.com/attachments/1002173915549937714/1120370986773139566/barreepic.gif")
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setColor(process.env.COLOR)
            .setFooter({ text: "ⲈpicBots", iconURL: "https://media.discordapp.net/attachments/1002173915549937714/1076559635563167895/Illustration_sans_titre.png?width=676&height=676" })
            .setTimestamp()
        interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })

    }
}