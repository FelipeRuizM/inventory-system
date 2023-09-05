import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Course = sequelize.define("courses", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  freezeTableName: true,
  timestamps: false
});

export default Course;

/*
INSERT INTO courses (name)
VALUES ('ICS-200'), ('ICS-215'), ('ICS-221'), ('ICS-223'), ('ICS-224');*/