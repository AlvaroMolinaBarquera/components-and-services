import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[table-detail]',
})
export class TableDetailDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}