import fs from 'fs/promises';
import path from 'path';

const logLevel = parseInt(process.env.LOG_LEVEL || '4', 10);

// Enum for log levels
enum LogLevels {
  NOTHING = 0,
  INTERNAL_ERROR = 1,
  FORBIDDEN = 2,
  ERROR = 3,
  ACTION = 4,
}

// Generic log function that checks log level
async function logToFile(logFileName: string, message: string, level: LogLevels) {
  if (logLevel >= level) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;

    try {
      const logFilePath = path.join(__dirname, logFileName);
      await fs.appendFile(logFilePath, logMessage);
    } catch (err) {
      console.error(`Error writing to log file (${logFileName}):`, err);
    }
  }
}

// Specific log functions with assigned log levels
async function logError(message: string) {
  await logToFile('server_errors.log', message, LogLevels.ERROR);
}

async function logAction(message: string) {
  await logToFile('server_actions.log', message, LogLevels.ACTION);
}

async function logForbidden(message: string) {
  await logToFile('server_forbidden_access.log', message, LogLevels.FORBIDDEN);
}

async function logInternalError(message: string) {
  await logToFile('server_internal_errors.log', message, LogLevels.INTERNAL_ERROR);
}

export {logError, logAction, logForbidden, logInternalError};
