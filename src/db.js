const Sequelize = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + '/users.db'
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

/*
async function task() {
  await db.sync() ;
  

  await Users.create({
    username: 'yash',
    pwd: 'test'
  })

}

task();
*/ 

module.exports = {
  db, Users
}



