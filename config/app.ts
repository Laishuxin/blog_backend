export interface AppConfig {
  port: number;
  addr: string;
  prefix: string;
  docs: string;
}
export default {
  port: 7891,
  addr: 'localhost',
  prefix: '/api/v1',
  docs: 'docs',
} as AppConfig;
