const sequelize = require("sequelize");
const { sequelizeInstance } = require("../database");

const Bots = sequelizeInstance.define('Bots', {
	id: {
		type: sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	botid: {
		type: sequelize.STRING(65)
	},
	token: {
		type: sequelize.STRING(100),
		allowNull: false,
	},
	default_prefix: {
		type: sequelize.STRING(10),
		allowNull: false,
	},
	owner: {
		type: sequelize.STRING(65),
		allowNull: false,
	},
	max_guild: {
		type: sequelize.INTEGER,
		allowNull: false,
	},
	type: {
		type: sequelize.STRING(65),
		allowNull: false,
	},
	DateStart: {
		type: sequelize.DATE,
		allowNull: false,
	},
	Duration: {
		type: sequelize.STRING(100),
		allowNull: false,
	},
	Status: {
		type: sequelize.STRING(65),
	},
	activity: {
		type: sequelize.STRING,
	},
	activitytype: {
		type: sequelize.STRING,
	},
	hasWarned : {
		type: sequelize.BOOLEAN,
		defaultValue: false
	},
	lastWarningTime : {
		type: sequelize.DATE,
	},
	Owners: {
        type: sequelize.JSON,
        allowNull: true,
    },
	Whitelist: {
        type: sequelize.JSON,
        allowNull: true,
    },
});


module.exports = {
	Bots
};