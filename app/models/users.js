/* jshint indent: 2 */
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
            username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
          },
          hashedPassword: {
            type: DataTypes.STRING
          },
          color: {
            type: DataTypes.STRING
          }
  }, {
    tableName: 'users'
  });
};

