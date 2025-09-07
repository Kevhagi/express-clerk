import { Sequelize } from 'sequelize';
import { getSupabaseConnectionString } from './supabase.js';

// Explicitly import pg to ensure it's available
import pg from 'pg';

// Check if we're using Supabase or traditional PostgreSQL
const useSupabase = process.env.USE_SUPABASE === 'true';

let sequelize: Sequelize;

if (useSupabase) {
  // Use Supabase connection string
  const connectionString = getSupabaseConnectionString();
  
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectModule: pg,
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
    },
  });
} else {
  // Use traditional PostgreSQL connection
  sequelize = new Sequelize({
    dialect: 'postgres',
    dialectModule: pg,
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
    },
  });
}

export default sequelize;
