import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';

const User = sequelize.define("users", {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  refreshtoken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
  {
    freezeTableName: true,
    timestamps: false
  });

export default User;