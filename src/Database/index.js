
const {Bots} = require("./Models/Bots");
const logger = require("../Libs/logger");

module.exports = () => {
    Bots.sync()
    logger.print("La base de donnée est bien connectée !").success();
}

