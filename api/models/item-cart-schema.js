import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Item from './item-schema.js';
import Cart from './cart-schema.js';

const ItemCart = sequelize.define("item_cart", {
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
Item.belongsToMany(Cart, { through: ItemCart });
Cart.belongsToMany(Item, { through: ItemCart });

export default ItemCart;