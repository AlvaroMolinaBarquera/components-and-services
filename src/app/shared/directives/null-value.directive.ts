import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[NullValue]'
})
export class NullValueDirective {
    constructor(private el: ElementRef, private control: NgControl) { }
    @HostListener('input', ['$event.target'])
    onEvent(target: HTMLInputElement) {
        const valueToSet = (target.value === '') ? null : target.value;
        this.control.control.setValue(valueToSet);
    }
}