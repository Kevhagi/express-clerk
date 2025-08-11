import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
  dialectOptions: {
    ssl: { 
      require: true, 
      rejectUnauthorized: false 
    },
    // ssl: process.env.NODE_ENV === 'production' ? {
    //   require: true,
    //   rejectUnauthorized: false
    // } : false,
  },
});

export default sequelize;
