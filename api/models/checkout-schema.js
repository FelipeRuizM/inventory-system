import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Checkout = sequelize.define("checkouts", {
  checkoutDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  returnDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expectedReturnDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cartid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  signoutStaff: {
    type: DataTypes.STRING,
    allowNull: true
  },
  signinStaff: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
  {
    freezeTableName: true,
    timestamps: false
  });

export default Checkout;