import {
  Component, ViewChild,
  ElementRef, Input, ContentChildren, AfterViewInit, QueryList, forwardRef,
  OnChanges
} from '@angular/core';
import { FileReaderService } from './../file-reader/file-reader.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ExpandedFiles } from './../models/expanded-files';

/** @see https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html */
@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true
    }
  ]
})
export class FileInputComponent implements AfterViewInit, ControlValueAccessor, OnChanges {
  @ViewChild('fileSelector') fileSelector: ElementRef;
  /** @todo Estaria bien poder pasarle un nombre que eligiera la aplicación */
  @ContentChildren('fileButton') buttonQueryList: QueryList<any>;
  @Input() multiple: boolean;
  @Input() accept: string;
  @Input() capture: string = null;
  files: ExpandedFiles[];
  private disabled = false;
  private buttonNativeElement: any;
  propagateChange: any = () => { };
  constructor(
    private fileReaderService: FileReaderService,
  ) { }

  ngAfterViewInit() {
    this.buttonQueryList.forEach((f) => {
      this.buttonNativeElement = f.nativeElement || f._elementRef.nativeElement;
      try {
        this.buttonNativeElement.onclick = (e: MouseEvent) => (!this.disabled) ? this.fileSelector.nativeElement.click() : null;
      } catch (e) {
        throw new Error('LQP-FILE-INPUT => El elemento no tiene "_elementRef.nativeElement" ni es un "nativeElement"' + e.message);
      }
    });
  }

  /** Función que se dispara cuando al pulsar el botón del file-input se añaden archivos */
  onFilesAdded() {
    const files = this.fileSelector.nativeElement.files;
    this.fileReaderService.readFilesAsBase64(files)
      .subscribe((f) => {
        this.files = f;
        this.propagateChange(this.files);
      });
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    /** ¿Aplicamos los estilos deshabilitados al botón? */
    // En teoria se hace con Render2.addClass and Render2.removeClass
  }

  ngOnChanges(files) {
    // Aqui irian las funciones de validación de haber alguna
    this.propagateChange(files);
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.files = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }



}
