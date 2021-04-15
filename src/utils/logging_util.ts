import { Request, Response } from 'express';

export interface LoggingInterface {
  trace(...args);
  debug(...args);
  log(...args);
  info(...args);
  warn(...args);
  warning?(...args);
  error(...args);
  fatal?(...args);
}

export interface LoggingOptions {
  salt?: string;
  logger?: LoggingInterface;
  hiddenFields?: string[];
  level?: keyof LoggingInterface;
}

export interface DatabaseInfo {
  type: string;
  database: string;
  username: string;
  sql?: string;
}

const loggingInWrapping = (str: string) => {
  return `<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
${str}
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n`;
};

const loggingOutWrapping = (str: string) => {
  return `>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
${str}
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n`;
};

/**
 * Logging request information.
 * @param req Request.
 * @returns The logging message
 */
export function loggingRequest(
  req: Request,
  {
    salt = '',
    logger = console,
    hiddenFields = [],
    level = 'info',
  }: LoggingOptions = {},
) {
  const stringify = JSON.stringify;
  const query = req.query;
  const params = req.params;
  const body = req.body;
  hiddenFields.forEach((field) => {
    if (query[field]) query[field] = undefined;
    if (params[field]) params[field] = undefined;
    if (body[field]) body[field] = undefined;
  });

  const msg = `Request original url: ${req.originalUrl}
Method: ${req.method}
IP: ${req.ip}
Params: ${stringify(params)}
Query: ${stringify(query)}
Body: ${stringify(body)}${salt ? '\n' + salt : ''}`;

  logger[level](loggingInWrapping(msg));
}

export function loggingResponse(
  req: Request,
  res: Response,
  {
    salt = '',
    logger = console,
    hiddenFields = [],
    level = 'info',
  }: LoggingOptions = {},
) {
  const stringify = JSON.stringify;
  const query = req.query;
  const params = req.params;
  const body = req.body;
  const status = res.statusCode;
  // console.log('response data = ');
  // console.log(data);

  hiddenFields.forEach((field) => {
    if (query[field]) query[field] = undefined;
    if (params[field]) params[field] = undefined;
    if (body[field]) body[field] = undefined;
  });

  const msg = `Request original url: ${req.originalUrl}
Method: ${req.method}
IP: ${req.ip}
Status Code: ${status}
Request Params: ${stringify(params)}
Request Query: ${stringify(query)}
Request Body: ${stringify(body)}${salt ? '\n' + salt : ''}`;

  logger[level](loggingOutWrapping(msg));
}

export function loggingResponseDataWithRequest(
  resData: any,
  req: Request,
  {
    salt = '',
    logger = console,
    hiddenFields = [],
    level = 'info',
  }: LoggingOptions = {},
) {
  if (resData) {
    hiddenFields.forEach((prop) => {
      if (resData[prop]) resData[prop] = undefined;
    });
  }
  const msg = `Request original url: ${req.originalUrl}
Method: ${req.method}
IP: ${req.ip}
Response data: ${JSON.stringify(resData)}${salt ? '\n' + salt : ''}`;

  logger[level](loggingOutWrapping(msg));
  return msg;
}

export function loggingDb(
  db: DatabaseInfo,
  {
    salt = '',
    logger = console,
    hiddenFields = [],
    level = 'info',
  }: LoggingOptions = {},
) {
  const sqlStr = db.sql ? `\nSql: ${db.sql}` : '';
  const saltStr = salt ? `\nsalt: ${salt}` : '';

  const msg = `>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
Db type: ${db.type}
Database: ${db.database}
Username: ${db.username}${sqlStr}${saltStr}
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`;
  logger[level](msg);
}
