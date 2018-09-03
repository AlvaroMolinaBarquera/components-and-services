import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table.component'
import { TableDetailDirective } from './table-detail/table-detail.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        DataTableComponent,
        TableDetailDirective,
    ],
    exports: [
        DataTableComponent,
        TableDetailDirective,
    ],
    entryComponents: [
        DataTableComponent
    ]
})
export class DataTableModule { }