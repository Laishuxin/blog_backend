import * as StackTrace from 'stacktrace-js';
import * as Path from 'path';
import * as Log4js from 'log4js';
const baseLogPath = Path.resolve(__dirname, '../../../logs');

type LoggerConfiguration = Log4js.Configuration;
export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF',
}

const commonConfig = {
  alwaysIncludePattern: true,
  pattern: 'yyyyMMdd',
  daysToKeep: 60,
  encoding: 'utf-8',
  compress: true,
  keepFileExt: true,
  numBackups: 3,
};

// set default configuration
const LOGGER_DEFAULT_CONFIGURATION: LoggerConfiguration = {
  appenders: {
    console: {
      type: 'console',
    },
    http: {
      ...commonConfig,
      type: 'dateFile',
      filename: `${baseLogPath}/http/http.log`,
    },
    httpResponse: {
      ...commonConfig,
      type: 'dateFile',
      filename: `${baseLogPath}/httpResponse/httpResponse.log`,
    },
    httpRequest: {
      ...commonConfig,
      type: 'dateFile',
      filename: `${baseLogPath}/httpRequest/httpRequest.log`,
    },
    database: {
      ...commonConfig,
      type: 'dateFile',
      filename: `${baseLogPath}/database/database.log`,
    },
    error: {
      ...commonConfig,
      type: 'dateFile',
      filename: `${baseLogPath}/error/error.log`,
    },
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'DEBUG',
    },
    http: {
      appenders: ['http'],
      level: 'INFO',
    },
    httpResponse: {
      appenders: ['httpResponse', 'http'],
      level: 'INFO',
    },
    httpRequest: {
      appenders: ['httpRequest', 'http'],
      level: 'INFO',
    },
    error: {
      appenders: ['error'],
      level: 'ERROR',
    },
    database: {
      appenders: ['database'],
      level: 'INFO',
    },
  },
  pm2: true,
  pm2InstanceVar: 'INSTANCE_ID',
};

Log4js.configure(LOGGER_DEFAULT_CONFIGURATION);
export function setConfig(config: LoggerConfiguration) {
  Log4js.configure(config);
}

// logger encapsulation
class Logger {
  private readonly logger: Log4js.Logger;

  constructor(category = 'default') {
    this.logger = Log4js.getLogger(category);
  }

  static getStackTrace(deep: number = 2): string {
    const stackList: StackTrace.StackFrame[] = StackTrace.getSync();
    const stackInfo: StackTrace.StackFrame = stackList[deep];
    // console.log(stackList)
    // console.log(stackInfo)

    const lineNumber: number = stackInfo.lineNumber;
    const columnNumber: number = stackInfo.columnNumber;
    const fileName: string = stackInfo.fileName;
    const basename: string = Path.basename(fileName);
    return `${basename}(line: ${lineNumber}, column: ${columnNumber})\n`;
  }

  public trace(...args) {
    this.logger.trace(Logger.getStackTrace(), ...args);
  }

  public debug(...args) {
    this.logger.debug(Logger.getStackTrace(), ...args);
  }

  public log(...args) {
    this.logger.info(Logger.getStackTrace(), ...args);
  }

  public info(...args) {
    this.logger.info(Logger.getStackTrace(), ...args);
  }

  public warn(...args) {
    this.logger.warn(Logger.getStackTrace(), ...args);
  }

  public warning(...args) {
    this.logger.warn(Logger.getStackTrace(), ...args);
  }

  public error(...args) {
    this.logger.error(Logger.getStackTrace(4), ...args);
  }

  public fatal(...args) {
    this.logger.fatal(Logger.getStackTrace(4), ...args);
  }
}

export function getLogger(category = 'default'): Logger {
  return new Logger(category);
}
