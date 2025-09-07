import dotenv from 'dotenv';
dotenv.config();

// Check if we're using Supabase or traditional PostgreSQL
const useSupabase = process.env.USE_SUPABASE === 'true';

const config = {
  development: useSupabase ? {
    // Supabase configuration
    username: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    database: process.env.SUPABASE_DB_NAME,
    host: process.env.SUPABASE_DB_HOST,
    port: Number(process.env.SUPABASE_DB_PORT || 5432),
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  } : {
    // Traditional PostgreSQL configuration
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  },
};

export default config;