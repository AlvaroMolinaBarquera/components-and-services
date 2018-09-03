import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EntryComponent } from './entry/entry.component';
import { DataTableModule } from './data-table/data-table.module';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    DataTableModule
  ],
  declarations: [EntryComponent],
  entryComponents: [EntryComponent],
  exports: [ DataTableModule]
})
export class SharedModule { }
