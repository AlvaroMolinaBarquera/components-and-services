import {Component, Input} from '@angular/core';

@Component({
  selector: 'modal-backdrop',
  template: '',
  host: {'[class]': '"modal-backdrop fade show" + (backdropClass ? " " + backdropClass : "")'}
})
export class ModalBackdropComponent {
  @Input() backdropClass: string;
}
