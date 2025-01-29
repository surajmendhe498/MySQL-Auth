const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a new Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql', // Database dialect (MySQL in this case)
  }
);

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to MySQL Database');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


  
module.exports = sequelize;