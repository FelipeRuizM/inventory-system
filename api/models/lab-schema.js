import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Course from './course-schema.js';

const Lab = sequelize.define("labs", {
  section: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  freezeTableName: true,
  timestamps: false
});

Lab.belongsTo(Course, {
  foreignKey: 'FK_course',
  allowNull: false
});
  
Course.hasMany(Lab, {
  foreignKey: 'FK_course',
  allowNull: false
});

export default Lab;

/*
INSERT INTO labs (section, FK_course)
VALUES ('X01A', 1), ('X01B', 1), ('X02A', 2), ('X02B', 2), ('X01A', 3);
*/