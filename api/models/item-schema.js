import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Home from './home-location-schema.js';

const Item = sequelize.define("items", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Available'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  });

Item.belongsTo(Home, {
  foreignKey: 'FK_location',
  allowNull: false
});

Home.hasMany(Item, {
  foreignKey: 'FK_location',
  allowNull: false
});

export default Item;

/*
INSERT INTO items (name, status, quantity, image, FK_location) VALUES
    ('HDMI cable', 'Available', 1, 'hdmi_cable.jpg', 6),
    ('Ethernet cable', 'Available', 1, 'ethernet_cable.jpg', 4),
    ('Keyboard', 'Available', 1, 'keyboard.jpg', 1),
    ('Monitor', 'Available', 1, 'monitor.jpg', 11),
    ('Mouse', 'Available', 1, 'mouse.jpg', 15),
    ('Printer', 'Available', 1, 'printer.jpg', 7),
    ('Headphones', 'Available', 1, 'headphones.jpg', 8),
    ('Microphone', 'Available', 1, 'microphone.jpg', 1),
    ('USB drive', 'Available', 1, 'usb_drive.jpg', 2),
    ('Laptop', 'Available', 1, 'laptop.jpg', 3),
    ('Scanner', 'Available', 1, 'scanner.jpg', 5),
    ('Router', 'Available', 1, 'router.jpg', 12),
    ('Speakers', 'Available', 1, 'speakers.jpg', 9),
    ('Wireless mouse', 'Available', 1, 'wireless_mouse.jpg', 2),
    ('External hard drive', 'Available', 1, 'external_hard_drive.jpg', 3);*/