const { Bots } = require("../../../Database/Models/Bots");
const logger = require("../../../Libs/logger");

module.exports = {
    name: 'ready',
    /**
     * @param {Discord.Interaction} interaction 
     */
    async execute(client) {
        try {
            await client.application.commands.set(client.slashCommands.map((cmd) => cmd));
            logger.print(`Connecté en tant que %s`, 'Discord').success(client.user.tag);
            logger.print(`Lien d'invitation du bot : https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot`).success();
        } catch (err) {
            logger.print('Erreur lors de la définition des commandes Slash ' + err).error(err);
            console.log(err)
        }


        setInterval(async function () {

            const guildId = process.env.MAIN_GUILD;
            const roleId = process.env.CLIENT_ROLE;

            const guild = client.guilds.cache.get(guildId);
            if (guild) {
                const bots = await Bots.findAll();
                const owners = Array.from(new Set(bots.flatMap(bot => bot.owner)));
                const role = guild.roles.cache.get(roleId);
                await guild.members.fetch()
                if (!role) return console.log("Role client innexistant")
                let membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(role.id));
                membersWithRole = membersWithRole.map(member => member.user.id);

                const combinedArray = [...new Set([...owners, ...membersWithRole])];

                combinedArray.forEach((member) => {
                    member = guild.members.cache.get(member)
                    if (member) {
                        const isBotOwner = bots.some(bot => {
                            return (!(Date.parse(bot.DateStart) + parseInt(bot.Duration)) < Date.now())
                                && bot.owner.includes(member.user.id);
                        });


                        if (isBotOwner) {
                            if (member.roles.cache.has(roleId)) return;
                            member.roles.add(roleId)
                                .then(() => {
                                    console.log(`Rôle ajouté au propriétaire du bot : ${member.user.tag}`);
                                })
                                .catch((error) => {
                                    console.error(`Erreur lors de l'ajout du rôle au propriétaire du bot : ${error}`);
                                });
                                return
                        } 
                        if (member.roles.cache.has(roleId)) member.roles.remove(roleId)
                                .then(() => {
                                    console.log(`Rôle retiré du membre : ${member.user.tag}`);
                                })
                                .catch((error) => {
                                    console.error(`Erreur lors du retrait du rôle au membre : ${error}`);
                                });
                        
                    }
                });
            }

        }, 60000);
    }
}