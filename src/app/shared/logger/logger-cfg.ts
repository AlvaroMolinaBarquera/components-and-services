import { LoggerConfig } from './models/logger-config.interface';
import { LOGGER_LEVELS } from './models/logger-levels.enum';
import { InjectionToken } from '@angular/core';
export const LoggerCfg = new InjectionToken<LoggerConfig>('LoggerCfg');
export const DefaultLoggerCfg: LoggerConfig = {
    level: LOGGER_LEVELS.SILLY,
    console: true,
    appendLevel: true,
    appendTimestamp: true
}