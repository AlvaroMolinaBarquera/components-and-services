import { Injectable, Inject } from '@angular/core';
import { LOGGER_LEVELS } from './../models/logger-levels.enum';
import { LoggerCfg } from './../logger-cfg';
import { LoggerConfig } from './../models/logger-config.interface';
@Injectable()
export class LoggerService {
    constructor(@Inject(LoggerCfg) private config: LoggerConfig) { }
    public silly = (msg: string, ...params) => this.log(LOGGER_LEVELS.SILLY, msg, ...params);
    public debug = (msg: string, ...params) => this.log(LOGGER_LEVELS.DEBUG, msg, ...params);
    public info = (msg: string, ...params) => this.log(LOGGER_LEVELS.INFO, msg, ...params);
    public warn = (msg: string, ...params) => this.log(LOGGER_LEVELS.WARN, msg, ...params);
    public error = (msg: string, ...params) => this.log(LOGGER_LEVELS.ERROR, msg, ...params);
    public fatal = (msg: string, ...params) => this.log(LOGGER_LEVELS.FATAL, msg, ...params);

    /**
     * Metodo generico por el cual van a pasar todas las trazas
     * @param level Nivel de la traza
     * @param msg Mensaje de la traza
     * @param params Parametros
     */
    private log(level: LOGGER_LEVELS, msg, ...params): void {
        // No pintamos las trazas por debajo del nivel configurado
        if (this.config.level > level) { return };
        // Solo pintamos las trazas por consoal si asi lo tenemos configurado
        if (this.config.console) {
            /** Literal por el cual tenemos que pintar por consola */
            const lvl = this.getConsoleLevel(level);
            // Le añadimos la hora si en formato ISO
            if (this.config.appendTimestamp) {
                let date = new Date().toISOString();
                date = date.substr(date.indexOf('T') + 1);
                msg = `${date} - ${msg}`
            }
            // Le añadimos
            if (this.config.appendLevel) {
                /** Color de las trazas y el estilo */
                const color = this.getConsoleColor(level);
                /** Literal de la traza (transforma el ENUM a str) */
                const strLvl = this.getLevelLiteral(level);
                console[lvl](`%c${strLvl}`, color, msg, ...params);
            } else {
                console[lvl](msg, ...params);
            }
        }
    }
    /** 
     * En base al nivel obtiene el console.XXX que tiene que ejecutar
     * @param level Nivel de traza recibido
     * @returns Str de consola a ejecutar
     */
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

    /** 
     * Obtiene los estilos que le va a poner a la primera palabra de la traza
     * @param level Nivel de traza recibido
     * @returns Estilo con colores
     */
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
                color = '#cfd8dc';
                break;
            case LOGGER_LEVELS.DEBUG:
                color = '#a094b7'
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

    /** 
     * En base al nivel obtiene el literal que va a aparecer por consola
     * @param level Nivel de la traza
     * @returns Literal de la traza
     */
    private getLevelLiteral(level: LOGGER_LEVELS) {
        const LITERALS = ['SILLY', 'DEBUG', 'INFO ', 'WARN ', 'ERROR', 'FATAL'];
        return LITERALS[level];
    }
}
