import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const { 
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD, 
  MYSQL_DATABASE, 
  MYSQL_DIALECT
} = process.env;

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD,
  {
    host: MYSQL_HOST,
    dialect: MYSQL_DIALECT,
    logging: false
  }
);

sequelize.authenticate().then(() => {
  console.log(`Logged in as ${MYSQL_USER} into ${MYSQL_DATABASE}`);
}).catch((err) => {
  console.log('Error: ' + err);
});

export default sequelize;