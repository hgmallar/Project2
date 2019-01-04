module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loggedOn: DataTypes.BOOLEAN,
    wins: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    losses: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    profileUrl: {
      type: DataTypes.STRING,
      defaultValue: "https://cuse.com/images/responsive/nav_logo_b.png",
      allowNull: false
    }

  });
  return User;
};
//this is the user's model!