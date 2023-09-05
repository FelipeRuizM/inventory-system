import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Lab from './lab-schema.js';

const Cart = sequelize.define("carts", {
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  freezeTableName: true,
  timestamps: false
});

Cart.belongsTo(Lab, {
  foreignKey: 'FK_lab',
  allowNull: false
});

Lab.hasMany(Cart, {
  foreignKey: 'FK_lab',
  allowNull: false
});

// sequelize.sync({alter: true});

export default Cart;