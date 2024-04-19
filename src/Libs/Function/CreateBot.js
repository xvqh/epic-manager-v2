
const { Bots } = require("../../Database/Models/Bots")
module.exports = async (token, defaultPrefix, owner, maxGuild, type, duration) => {
    try {
        const newBot = await Bots.create({
          token: token,
          default_prefix: defaultPrefix,
          owner: owner,
          max_guild: maxGuild,
          type: type,
          DateStart: Date.now(),
          Duration: duration,
        });
        console.log('Nouveau bot ajouté :', newBot.toJSON());
        return newBot
      } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'ajout du bot :', error);
        return false
      }
}