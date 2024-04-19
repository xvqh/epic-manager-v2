
module.exports = async (interaction) => {
    let role = interaction.guild.roles.cache.get(process.env.ADMIN_ROLE)
    if(role){
        if(interaction.member.roles.cache.has(role.id)) return true
    }
    return false
}