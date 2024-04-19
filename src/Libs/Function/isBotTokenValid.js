const { Client, Partials, GatewayIntentBits } = require('discord.js');
module.exports = async (token) => {

    const client = new Client({
        intents: [
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent
        ],
        partials: [
            Partials.Channel,
            Partials.User,
            Partials.Message,
            Partials.GuildMember,
        ],
    });

    try {
        await client.login(token);
        const botUser = client.user;

        if (botUser.bot) {
            return botUser.id;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}
