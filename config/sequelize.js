var Sequelize = require("sequelize");
var config = require ('./config')
var sequelize = new Sequelize(config.sequelizeUrl);
// var sequelize = new Sequelize(config.database,config.username,config.password);

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection to database has been established successfully.');
  }, function (err) { 
    console.log('Unable to connect to the database:', err);
  });
db={};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 