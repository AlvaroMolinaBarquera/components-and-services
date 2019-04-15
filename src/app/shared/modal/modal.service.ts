import { Injectable, Inject,
   ComponentFactoryResolver , Injector, ApplicationRef, ComponentRef, ComponentFactory} from '@angular/core';

import { ModalWindowComponent } from './modal-window/modal-window.component';
import { ModalBackdropComponent } from './modal-backdrop/modal-backdrop.component';
import { DOCUMENT } from '@angular/common';
import { ContentRef } from './utils/content-ref';
import { ModalRef, ActiveModal } from './modal-ref';

@Injectable()
export class ModalService {
  private windowAttributes = ['ariaLabelledBy', 'backdrop', 'centered', 'keyboard', 'size', 'windowClass'];
  constructor(
      private _moduleCFR: ComponentFactoryResolver,
      private _injector: Injector,
      private _applicationRef: ApplicationRef,
      @Inject(DOCUMENT) private _document,
    ) {}

  open(content: any, options: any = {}) {  
    const containerEl = this._document.body;
    const activeModal = new ActiveModal();
    const contentRef = this._createFromComponent(this._injector, content,activeModal);
    const backdropCmptRef: ComponentRef<ModalBackdropComponent> = this._attachBackdrop(containerEl);
    const windowCmptRef: ComponentRef<ModalWindowComponent> = this._attachWindowComponent(containerEl, contentRef);
    const modalRef: ModalRef = new ModalRef(windowCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);
    activeModal.close = (result: any) => { modalRef.close(result); };
    activeModal.dismiss = (reason: any) => { modalRef.dismiss(reason); };
    this.applyWindowOptions(windowCmptRef.instance, options);
    return modalRef;
  }

  private _createFromComponent(
    contentInjector: Injector, content: any, context: ActiveModal,
  ): ContentRef {
    const contentCmptFactory = this._moduleCFR.resolveComponentFactory(content);
    const modalContentInjector = Injector.create([{provide: ActiveModal, useValue: context}], contentInjector);
    const componentRef = contentCmptFactory.create(modalContentInjector);
    this._applicationRef.attachView(componentRef.hostView);
    return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
  }

  private _attachWindowComponent(containerEl: any, contentRef: any): ComponentRef<ModalWindowComponent> {
    const windowFactory = this._moduleCFR.resolveComponentFactory(ModalWindowComponent);
    const windowCmptRef = windowFactory.create(this._injector, contentRef.nodes);
    this._applicationRef.attachView(windowCmptRef.hostView);
    containerEl.appendChild(windowCmptRef.location.nativeElement);
    return windowCmptRef;
  }

  private _attachBackdrop(containerEl: any): ComponentRef<ModalBackdropComponent> {
    const backdropFactory: ComponentFactory<ModalBackdropComponent> =
        this._moduleCFR.resolveComponentFactory(ModalBackdropComponent);
    const backdropCmptRef = backdropFactory.create(this._injector);
    this._applicationRef.attachView(backdropCmptRef.hostView);
    containerEl.appendChild(backdropCmptRef.location.nativeElement);
    return backdropCmptRef;
  }

  private applyWindowOptions(windowInstance: ModalWindowComponent, options: Object): void {
    this.windowAttributes.forEach((optionName: string) => {
      if (options[optionName]) {
        windowInstance[optionName] = options[optionName];
      }
    });
  }
}
