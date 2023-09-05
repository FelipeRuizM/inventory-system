import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Home = sequelize.define("locations", {
  aisle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  row: {
    type: DataTypes.STRING,
    allowNull: false
  },
  column: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
  freezeTableName: true,
  timestamps: false
});

// Home.sync( { alter: true });

export default Home;