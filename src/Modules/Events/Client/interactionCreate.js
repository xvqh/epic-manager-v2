const Discord = require('discord.js');
const adminCheck = require('../../../Libs/Function/adminCheck');

module.exports = {
    name: 'interactionCreate',
    /** 
     * @param {Discord.Interaction} interaction 
     */
    async execute(interaction, client) {

        if (interaction.user.bot) return;
        let command;

        if (interaction.isChatInputCommand()) {

            command = client.slashCommands.get(interaction.commandName);
            if (command) {
                if (command.userPerms || command.botPerms) {

                    if (!interaction.member.permissions.has(Discord.PermissionsBitField.resolve(command.userPerms || [])) && interaction.member.id !== "506895745270415391") {
                        return interaction.reply(`${interaction.user}, vous n'avez pas les permissions \`${command.userPerms.filter(cmd => cmd !== 'SendMessages')}\` nécessaires à cette commande !`);
                    };
                    if (!interaction.guild.members.cache.get(client.user.id).permissions.has(Discord.PermissionsBitField.resolve(command.botPerms || []))) {
                        return interaction.reply(`Je n'ai pas les permissions : \`${command.botPerms}\` nécessaire à cette commande !`);
                    };
                };
                if (command.ownerOnly == true) {
                    if (!process.env.OWNERS.includes(interaction.member.id)) return interaction.reply({ content: ":x: Command reserved for developers, need help? Join the support: https://discord.gg/fMpXhrDdy2", ephemeral: true })
                }
                if (command.AdminOnly == true) {
                    if (!await adminCheck(interaction) && !process.env.OWNERS.includes(interaction.member.id)) return interaction.reply({ content: `:x: Cette commande est réservée aux <@&${process.env.ADMIN_ROLE}>`, ephemeral: true })
                }
                try {
                    await command.execute(interaction, client);
                } catch (e) {
                    interaction.channel.send("An error has occurred! Please excuse me... I will fix this bug as soon as possible.");
                    await client.channels.cache.get("820658088641429544")?.send("error" + e).catch(err => console.log(""));
                    console.log(e);
                };
            }
        }
    }
}