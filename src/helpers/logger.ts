import chalk from 'chalk';

export class Logger {
  private static formatDate(): string {
    return new Date().toISOString();
  }

  static info(message: string, ...optional: unknown[]) {
    console.log(`${chalk.gray(this.formatDate())} ${chalk.blue('[INFO]')} ${message}`, ...optional);
  }

  static warn(message: string, ...optional: unknown[]) {
    console.warn(
      `${chalk.gray(this.formatDate())} ${chalk.yellow('[WARN]')} ${message}`,
      ...optional
    );
  }

  static error(message: string, ...optional: unknown[]) {
    console.error(
      `${chalk.gray(this.formatDate())} ${chalk.red('[ERROR]')} ${message}`,
      ...optional
    );
  }

  static debug(message: string, ...optional: unknown[]) {
    if (process.env.NODE_ENV === 'production') return; // Skip debug logs in production
    console.debug(
      `${chalk.gray(this.formatDate())} ${chalk.magenta('[DEBUG]')} ${message}`,
      ...optional
    );
  }
}
