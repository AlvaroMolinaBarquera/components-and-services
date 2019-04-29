import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EntryComponent } from './entry/entry.component';
import { DataTableModule } from './data-table/data-table.module';
import { FilesModule } from './files/files.module';
import { OnlyNumbersDirective } from './directives/only-number.diretive';
import { NullValueDirective } from './directives/null-value.directive';
import { LoggerModule } from './logger/logger.module';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    DataTableModule,
    FilesModule,
    LoggerModule.forRoot(null)
  ],
  declarations: [EntryComponent, OnlyNumbersDirective, NullValueDirective],
  entryComponents: [EntryComponent],
  exports: [DataTableModule, FilesModule, OnlyNumbersDirective, NullValueDirective, LoggerModule]
})
export class SharedModule { }
