import db from '../../config/database';
import { Sequelize, QueryTypes, QueryOptionsWithType } from 'sequelize';
import { getLogger } from 'src/utils/logger';
import { loggingDb } from 'src/utils/logging_util';

const mysqlConfig = db.mysql;
const isProductionEnv = process.env.NODE_ENV === 'production';
const dbLogger = getLogger('database');

const sequelize = new Sequelize(
  mysqlConfig.database,
  mysqlConfig.username,
  mysqlConfig.password,
  {
    dialect: 'mysql',
    port: mysqlConfig.port,
    host: mysqlConfig.host,
    logging: console.log,
    // logQueryParameters: false,
    pool: {
      min: 0,
      max: mysqlConfig.connectionLimit,
      idle: 10 * 1000,
      acquire: 30 * 1000,
    },
    timezone: '+08:00',
  },
);

sequelize
  .authenticate()
  .then(() => {
    if (!isProductionEnv) {
      console.log(`[db]: connected ${mysqlConfig.database} successfully`);
    }
    loggingDb(
      {
        type: 'mysql',
        database: mysqlConfig.database,
        username: mysqlConfig.username,
      },
      {
        level: 'info',
        logger: dbLogger,
      },
    );
  })
  .catch((err) => {
    if (!isProductionEnv) {
      console.log(
        `[db]: connected ${mysqlConfig.database} occurs error with ${err.message}`,
      );
    }
    loggingDb(
      {
        type: 'mysql',
        database: mysqlConfig.database,
        username: mysqlConfig.username,
      },
      {
        level: 'error',
        logger: dbLogger,
      },
    );
    throw err;
  });

export async function query<T = any>(
  sql: string,
  { logging = false, raw = true, convertBuffer = true } = {},
): Promise<T[]> {
  try {
    const result = (await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      logging,
      raw,
    })) as any;
    if (Array.isArray(result) && convertBuffer) {
      result.forEach(item => {
        for (let i in item) {
          if (Buffer.isBuffer(item[i])) {
            item[i] = item[i][0]
          }
        }
      })
    }
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject([]);
  }
}

/**
 * Executing insert
 * @param sql sql query
 * @param param1
 * @returns null if ok, err.message if error occurs.
 */
export async function insert(
  sql: string,
  { logging = true } = {},
): Promise<string | null> {
  try {
    await sequelize.query(sql, {
      type: QueryTypes.INSERT,
      logging,
    });
    return Promise.resolve(null);
  } catch (err) {
    return Promise.reject(
      err.message && err.message !== '' ? err.message : 'service error',
    );
  }
}

export default sequelize;
