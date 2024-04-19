
module.exports = async (status) => {
    if(!status || status =="0") return "🟢 En ligne"
    return `${status.replace("1", "❌ token invalide").replace("2", "⏰ expiré").replace("3", "⚙️ autre erreur").replace("4", "👨‍⚖️ suspendu").replace("5", "🔴 Hors ligne")}`;
}