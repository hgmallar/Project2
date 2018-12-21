module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    loggedOn: DataTypes.BOOLEAN
  });
  return User;
};
