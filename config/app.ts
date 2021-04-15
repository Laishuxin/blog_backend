const appIp = process.env.APP_IP || 'localhost';
const appPort = parseInt(process.env.APP_PORT) || 8888;
const apiPrefix = process.env.API_PREFIX || ''
const apiDocsPath = process.env.API_DOCS_PATH || 'docs';

export interface AppConfig {
  port: number;
  addr: string;
  prefix: string;
  docs: string;
}
export default {
  port: appPort,
  addr: appIp,
  prefix: apiPrefix,
  docs: apiDocsPath,
} as AppConfig;
