const Sequelize = require('sequelize')
var path = require('path')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../users.db')
})

const Users = db.define('user', {

  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.DataTypes.STRING(127),
    allowNull: false,  
    unique: true
  },
  pwd: {
    type: Sequelize.DataTypes.STRING(150),
    allowNull: false
  }
});

module.exports = {
  db, Users
}



