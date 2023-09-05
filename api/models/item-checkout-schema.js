import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Checkout from './checkout-schema.js';
import Item from './item-schema.js';

const ItemCheckout = sequelize.define("item_checkout", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
},
{
  freezeTableName: true,
  timestamps: false
});

// Define the associations
Item.belongsToMany(Checkout, { through: ItemCheckout });
Checkout.belongsToMany(Item, { through: ItemCheckout });

export default ItemCheckout;