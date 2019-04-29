import { Injectable, Inject } from '@angular/core';
import { LOGGER_LEVELS } from './../models/logger-levels.enum';
import { LoggerCfg } from './../logger-cfg';
import { LoggerConfig } from './../models/logger-config.interface';
@Injectable()
export class LoggerService {
    constructor(@Inject(LoggerCfg) private config: LoggerConfig) {}
    public silly = (msg: string, ...params) => this.log(LOGGER_LEVELS.SILLY, msg, ...params);
    public debug = (msg: string, ...params) => this.log(LOGGER_LEVELS.DEBUG, msg, ...params);
    public info = (msg: string, ...params) => this.log(LOGGER_LEVELS.INFO, msg, ...params);
    public warn = (msg: string, ...params) => this.log(LOGGER_LEVELS.WARN, msg, ...params);
    public error = (msg: string, ...params) => this.log(LOGGER_LEVELS.ERROR, msg, ...params);
    public fatal = (msg: string, ...params) => this.log(LOGGER_LEVELS.FATAL, msg, ...params);

    private log(level: LOGGER_LEVELS, msg, ...params) {
        if (this.config.console) {
            const lvl = this.getConsoleLevel(level);
            const color = this.getConsoleColor(level);
            if (this.config.appendTimestamp) {
                let date = new Date().toISOString();
                date = date.substr(date.indexOf('T') + 1);
                msg = `${date} - ${msg}`
            }
            if (this.config.appendLevel) {
                console[lvl](`%c${level}`, color, msg, ...params);
            } else {
                console[lvl](msg, ...params);
            }
        }
    }

    private getConsoleLevel(level: LOGGER_LEVELS): string {
        switch (level) {
            case LOGGER_LEVELS.SILLY:
            case LOGGER_LEVELS.DEBUG:
                return 'log';
            case LOGGER_LEVELS.INFO:
                return 'info';
            case LOGGER_LEVELS.WARN:
                return 'warn';
            case LOGGER_LEVELS.ERROR:
            case LOGGER_LEVELS.FATAL:
                return 'error';
        }
    }

    private getConsoleColor(level: LOGGER_LEVELS): string {
        const TO_REPLACE = '%COLOR%'
        const base = [
            'background-color: ' + TO_REPLACE,
            'border-radius: 10%',
            'padding: 0.25em',
            'color: white'
        ].join(';')
        let color = null;
        switch (level) {
            case LOGGER_LEVELS.SILLY:
            case LOGGER_LEVELS.DEBUG:
                color = '#cfd8dc';
                break;
            case LOGGER_LEVELS.INFO:
                color = '#0081cb';
                break;
            case LOGGER_LEVELS.WARN:
                color = '#ffd600';
                break;
            case LOGGER_LEVELS.ERROR:
                color = '#ff5131';
                break;
            case LOGGER_LEVELS.FATAL:
                color = '#9b0000';
                break;
        }
        return base.replace(TO_REPLACE, color);
    }
}
