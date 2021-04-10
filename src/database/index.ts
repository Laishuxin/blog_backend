import db from '../../config/database';
import { Sequelize, QueryTypes, QueryOptionsWithType } from 'sequelize';
import { printInfo } from 'src/utils/print_utils';

const mysqlConfig = db.mysql;
const isProductionEnv = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  mysqlConfig.database,
  mysqlConfig.username,
  mysqlConfig.password,
  {
    dialect: 'mysql',
    port: mysqlConfig.port,
    host: mysqlConfig.host,
    logging: console.log,
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
      printInfo(`[db]: connected ${mysqlConfig.database} successfully`);
    }
  })
  .catch((err) => {
    if (!isProductionEnv) {
      printInfo(
        `[db]: connected ${mysqlConfig.database} occurs error with ${err.message}`,
      );
    }
    throw err;
  });

export async function query<T = any>(
  sql: string,
  { logging = true, raw = true } = {},
): Promise<T[]> {
  try {
    const result = (await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      logging,
      raw,
    })) as any;
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
    return Promise.resolve(null)
  } catch (err) {
    return Promise.reject(
      err.message && err.message !== '' ? err.message : 'service error',
    );
  }
}

export default sequelize;
