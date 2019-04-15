import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalWindowComponent } from './modal-window/modal-window.component';
import { ModalService } from './modal.service';
import {ModalBackdropComponent } from './modal-backdrop/modal-backdrop.component';
import { ActiveModal } from './modal-ref';
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ModalService, ActiveModal],
  entryComponents: [ModalWindowComponent, ModalBackdropComponent],
  declarations: [ModalWindowComponent, ModalBackdropComponent]
})
export class ModalModule { }
