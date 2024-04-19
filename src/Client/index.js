const LoadCommands = require("./Handlers/commands");
const LoadEvents = require("./Handlers/events");
const Connectdatabase = require("./Handlers/database");
const color = require("color");
const colors = require("colors");
require("dotenv").config();
const {
    Collection
} = require("discord.js");

module.exports = async client => {

    // Initialisation des collections et de la couleur des embeds
    client.slashCommands = new Collection();
    client.cooldown = new Collection();

    client.color = "Black";

    // Chargement des commandes
    LoadCommands(client);

    // Chargement des événements
    LoadEvents(client);

    // Connexion à la base de données
    Connectdatabase();

    // Connexion du bot
    client.login(process.env.TOKEN).catch((err) => {
        const errorMsg = process.env.TOKEN.length < 1 ?
            "Vous n'avez pas mis de token dans le fichier .env !" :
            `[ ${process.env.TOKEN} ] invalide !`;
        console.error(new Error(colors.red(errorMsg)));
    });
}