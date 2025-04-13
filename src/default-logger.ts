import { Logger } from './types';

/**
 * A simple logger implementation
 */
export class DefaultLogger implements Logger {
  public info(message: string, ...args: any[]): void {
    console.log(`[INFO] ${message}`, ...args);
  }

  public error(message: string, error?: Error, ...args: any[]): void {
    console.error(`[ERROR] ${message}`, error ? error : '', ...args);
  }
}