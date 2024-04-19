
const { Bots } = require("../../Database/Models/Bots");
const logs = require("./logs");
module.exports = async (interaction, token, updatedFields) => {
    try {
      const bot = await Bots.findOne({
        where: {
          token: token
        }
      });
  
      if (!bot) {
        console.error("Bot non trouvé.");
        return false;
      }
      let botte = await bot.update(updatedFields);
      logs(interaction, `**Modérateur:** \`${interaction.user.username}\`
**Identifiant du bot:** \`${botte.id}\`
**Owner du bot:** \`${botte.owner}\`
**Type du bot:** \`${botte.type}\`
**Nombre maximum de serveurs:** \`${botte.max_guild}\`
**Il expirera** <t:${Math.floor((new Date(botte.DateStart).getTime() + parseInt(botte.Duration)) / 1000)}:R>`,"Un bot vient d'être modifié")
      } catch (error) {
        console.error('Une erreur s\'est produite lors de a modification du bot :', error);
        return false
      }
}