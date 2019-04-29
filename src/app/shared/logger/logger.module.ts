import { NgModule } from '@angular/core';
import { LoggerService } from './shared/logger.service';
import { LoggerCfg, DefaultLoggerCfg } from './logger-cfg';

@NgModule()
export class LoggerModule {
    static forRoot(config: any) {
        return {
            ngModule: LoggerModule,
            providers: [
                LoggerService,
                {
                    provide: LoggerCfg,
                    useValue: (config) ? config :  DefaultLoggerCfg,
                }
            ]
        }
    }
}
