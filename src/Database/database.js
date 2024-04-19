const sequelize = require("sequelize");

const sequelizeInstance = new sequelize.Sequelize({
  dialect: "",
  host: "",
  port: 3306,
  username: "",
  password: "",
  database: "",
  logging: false,
  define: {
      timestamps: true
  }
})
module.exports = { sequelizeInstance };