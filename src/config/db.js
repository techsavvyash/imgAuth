const Sequelize = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: '../../users.db'
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



