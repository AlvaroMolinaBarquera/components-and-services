import { LOGGER_LEVELS } from './logger-levels.enum';
export interface LoggerConfig {
    level: LOGGER_LEVELS,
    console?: boolean;
    appendLevel?: boolean;
    appendTimestamp?: boolean;
}