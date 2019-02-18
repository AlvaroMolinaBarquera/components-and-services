import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EntryComponent } from './entry/entry.component';
import { DataTableModule } from './data-table/data-table.module';
import { FilesModule } from './files/files.module';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    DataTableModule,
    FilesModule
  ],
  declarations: [EntryComponent],
  entryComponents: [EntryComponent],
  exports: [ DataTableModule, FilesModule]
})
export class SharedModule { }
