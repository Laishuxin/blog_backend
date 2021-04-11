import chalk from 'chalk';
const log = console.log;

export const printError = (...msg: any[]) => {
  // log(chalk.whiteBright(chalk.bgRedBright(...msg)))
  log(chalk.redBright(...msg));
};
export const printInfo = (...msg: any[]) => {
  // log(chalk.whiteBright(chalk.bgGreenBright(...msg)))
  log(msg);
};
export const printWarning = (...msg: any[]) => {
  // log(chalk.whiteBright(chalk.bgYellowBright(...msg)))
  log(chalk.yellowBright(...msg));
};
