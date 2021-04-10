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
    port: 3306,
    host: 'localhost',
    username: 'admin',
    password: 'admin',
    database: 'db_blog',
    connectionLimit: 10,
  },
};

const developmentConfig: DBsConfig = {
  mysql: {
    port: 3306,
    host: 'localhost',
    username: 'admin',
    password: 'admin',
    database: 'db_blog',
    connectionLimit: 10,
  },
};

const config =
  process.env.NODE_ENV === 'production' ? productConfig : developmentConfig;

export default config;
