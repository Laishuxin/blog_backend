import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
const dbMysqlHost = process.env.DB_MYSQL_HOST;
const dbMysqlPort = parseInt(process.env.DB_MYSQL_PORT) || 3306;
const dbMysqlUsername = process.env.DB_MYSQL_USERNAME;
const dbMysqlPassword = process.env.DB_MYSQL_PASSWORD;
const dbMysqlLimit = parseInt(process.env.DB_MYSQL_LIMIT) || 10;
const dbMysqlDatabase = process.env.DB_MYSQL_DATABASE;

// TODO(rushui 2021-04-09): read config for dotenv
export interface DBConfig {
  port: number;
  host: string;
  username: string;
  password: string;
  database: string;
  connectionLimit?: number;
}

export interface DBsConfig {
  mysql?: DBConfig;
}

const productConfig: DBsConfig = {
  mysql: {
    port: dbMysqlPort,
    host: dbMysqlHost,
    username: dbMysqlUsername,
    password: dbMysqlPassword,
    database: dbMysqlDatabase,
    connectionLimit: dbMysqlLimit,
  },
};

const developmentConfig: DBsConfig = {
  mysql: {
    port: dbMysqlPort,
    host: dbMysqlHost,
    username: dbMysqlUsername,
    password: dbMysqlPassword,
    database: dbMysqlDatabase,
    connectionLimit: dbMysqlLimit,
  },
};

const config =
  process.env.NODE_ENV === 'production' ? productConfig : developmentConfig;

export default config;
