/**
 * Logger utility for VAPI integration
 * Provides consistent logging across all services
 */

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export class Logger {
    private context: string;
    private isDevelopment: boolean;

    constructor(context: string) {
        this.context = context;
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    private formatMessage(level: LogLevel, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
        return `[${timestamp}] [${level}] [${this.context}] ${message}${dataStr}`;
    }

    debug(message: string, data?: any): void {
        if (this.isDevelopment) {
            console.log(this.formatMessage(LogLevel.DEBUG, message, data));
        }
    }

    info(message: string, data?: any): void {
        console.log(this.formatMessage(LogLevel.INFO, message, data));
    }

    warn(message: string, data?: any): void {
        console.warn(this.formatMessage(LogLevel.WARN, message, data));
    }

    error(message: string, error?: Error | any, data?: any): void {
        const errorData = {
            ...data,
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
            } : error,
        };
        console.error(this.formatMessage(LogLevel.ERROR, message, errorData));
    }

    // Utility method for timing operations
    async timeAsync<T>(
        operationName: string,
        operation: () => Promise<T>
    ): Promise<T> {
        const startTime = Date.now();
        this.debug(`Starting: ${operationName}`);

        try {
            const result = await operation();
            const duration = Date.now() - startTime;
            this.debug(`Completed: ${operationName}`, { duration: `${duration}ms` });
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.error(`Failed: ${operationName}`, error, { duration: `${duration}ms` });
            throw error;
        }
    }
}

// Convenience function to create loggers
export function createLogger(context: string): Logger {
    return new Logger(context);
}



