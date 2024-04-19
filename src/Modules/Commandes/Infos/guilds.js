const Discord = require('discord.js')

module.exports = {

    name: "guilds",
    description: "Affiches tous les serveurs du bot.",
    ownerOnly: true,
    userPerms: ["SendMessages"],
    botPerms: ["SendMessages"],

    async execute(interaction, client, color) {

        let row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Liste des serveurs')
            )
        const bot = client;
        let i0 = 0;
        let i1 = 10;
        let page = 1;
        let serv = null
        let embed
        let guilde = client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map(e => e)
            .slice(0, 10)

        let button_next = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('next').setEmoji("▶️")
        let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('back').setEmoji("◀️")

        let button_row = new Discord.ActionRowBuilder().addComponents([button_back, button_next])

        interaction.reply(`Chargement en cours...`).then(mmm => {
            guilds()
            const collector = mmm.createMessageComponentCollector({
                componentType: Discord.ComponentType.Button,
                time: 150000
            })
            const collectorr = mmm.createMessageComponentCollector({
                componentType: Discord.ComponentType.StringSelect,
                time: 150000
            })
            collector.on("collect", async (i) => {
                if (i.user.id !== interaction.member.id) return i.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                await i.deferUpdate()
                if (i.customId === 'return') {
                    return guilds()
                }
                if (i.customId === 'leave') {
                    i.followUp(":white_check_mark: J'ai quitté " + serv.name)

                    serv.leave()
                    return guilds()
                }
                if (i.customId === 'invite') {
                    let channel = serv.channels.cache.first()
                    try {
                    await channel
                        .createInvite({ maxAge: 0, maxUses: 2 })
                        .then(async (invite) => {
                            i.followUp(invite.url)
                        })} catch(e){
                            console.log(e)
                            i.followUp(":x: Error:"+e)
                        }
                    return
                }
                if (i.customId === 'back') {
                    i0 = i0 - 10;
                    i1 = i1 - 10;
                    page = page - 1;

                    if (i0 + 1 < 0) {
                        return
                    }
                    description =
                        `Total des serveurs - ${bot.guilds.cache.size}\n\n` +
                        bot.guilds.cache
                            .sort((a, b) => b.memberCount - a.memberCount)
                            .map(r => r)
                            .map(
                                (r, i) =>
                                    `**${i + 1}** - ${r.name} (${r.id}) | Membres: ${r.memberCount}`
                            )
                            .slice(i0, i1)
                            .join("\n\n");

                    embed
                        .setFooter({
                            text:
                                `Page - ${page}/${Math.round(bot.guilds.cache.size / 10 + 1)}`
                        })
                        .setDescription(description);
                    guilde = client.guilds.cache
                        .sort((a, b) => b.memberCount - a.memberCount)
                        .map(e => e)
                        .slice(i0, i1)

                    row = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.StringSelectMenuBuilder()
                                .setCustomId('select')
                                .setPlaceholder('Liste des serveurs')
                        )
                    for (let i in guilde) {
                        row.components[0].addOptions(
                            {
                                label: `${guilde[i].name}`,
                                description: `${guilde[i].memberCount}`,
                                value: `${guilde[i].id}`
                            })
                    }
                    interaction.editReply({ embeds: [embed], components: [row, button_row] });
                }

                if (i.customId === 'next') {
                    i0 = i0 + 10;
                    i1 = i1 + 10;
                    page = page + 1;
                    //if (i1 > bot.guilds.cache.size + 10) {
                      //  return
                    //}
                    if (!i0 || !i1) {
                        return
                    }
                    description =
                        `Total des serveurs - ${bot.guilds.cache.size}\n\n` +
                        bot.guilds.cache
                            .sort((a, b) => b.memberCount - a.memberCount)
                            .map(r => r)
                            .map(
                                (r, i) =>
                                    `**${i + 1}** - ${r.name} (${r.id}) | Membres: ${r.memberCount}`
                            )
                            .slice(i0, i1)
                            .join("\n\n");

                    embed
                        .setFooter({
                            text:
                                `Page - ${page}/${Math.round(bot.guilds.cache.size / 10 + 1)}`
                        })
                        .setDescription(description);

                    guilde = client.guilds.cache
                        .sort((a, b) => b.memberCount - a.memberCount)
                        .map(e => e)
                        .slice(i0, i1)

                    row = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.StringSelectMenuBuilder()
                                .setCustomId('select')
                                .setPlaceholder('Liste des serveurs')
                        )
                    for (let i in guilde) {
                        row.components[0].addOptions(
                            {
                                label: `${guilde[i].name}`,
                                description: `${guilde[i].memberCount}`,
                                value: `${guilde[i].id}`
                            })
                    }
                    interaction.editReply({ embeds: [embed], components: [button_row, row] });
                }
            });

            collectorr.on('collect', async select => {
                if (select.user.id !== interaction.member.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                const value = select.values[0]
                let guild = await client.guilds.cache.get(value)
                if (guild) lookguild(guild)
            })
            collector.on("end", async () => {
                button_row.components[0].setDisabled(true);
                button_row.components[1].setDisabled(true);
                return interaction.editReply({ content: "Expiré !", embeds: [], components: [row, button_row] }).catch(() => { })
            })
        })



        function lookguild(guild) {
            embed = new Discord.EmbedBuilder()
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setThumbnail(guild.iconURL({ dynamic: true }))

                .addFields([{ name: "Membres:", value: `${guild.memberCount} `, inline: false },
                { name: "ID:", value: `${guild.id}`, inline: false },
                { name: "Owner:", value: guild.members.cache.get(guild.ownerId) ? guild.members.cache.get(guild.ownerId).user.tag : `Pas de compte couronne trouvé`, inline: false }])
            let back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('return').setEmoji("↩️")
            let leave = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Danger).setCustomId('leave').setEmoji("🔴").setLabel("Quitter " + guild.name)
            let invite = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Success).setCustomId('invite').setEmoji("📩").setLabel("Créer une invitation")
            let buttons = new Discord.ActionRowBuilder().addComponents([back, leave, invite])
            serv = guild
            return interaction.editReply({ embeds: [embed], components: [buttons] }).catch(() => { })
        }








        async function guilds() {

            guilde = await client.guilds.cache
                .sort((a, b) => b.memberCount - a.memberCount)
                .map(e => e)
                .slice(0, 10)
            let description =
                `Total des serveurs - ${bot.guilds.cache.size}\n\n` +
                guilde
                    .map(r => r)
                    .map(
                        (r, i) =>
                            `**${i + 1}** - ${r.name} (${r.id}) | Membres: ${r.memberCount}`
                    )
                    .join("\n\n");


            row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('select')
                        .setPlaceholder('Liste des serveurs')
                )
            for (let i in guilde) {
                row.components[0].addOptions(
                    {
                        label: `${guilde[i].name}`,
                        description: `${guilde[i].memberCount}`,
                        value: `${guilde[i].id}`
                    })
            }

             embed = new Discord.EmbedBuilder()
                .setAuthor({ name: bot.user.tag, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

                .setFooter({ text: `Page - ${page}/${Math.ceil(bot.guilds.cache.size / 10)}` })
                .setDescription(description);

            await interaction.editReply({
                content: "",
                embeds: [embed],
                components: [row, button_row],
                allowedMentions: { repliedUser: false }
            })
        }
    },
};
