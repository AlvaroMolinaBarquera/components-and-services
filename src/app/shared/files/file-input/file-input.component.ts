import {
  Component, ViewChild,
  ElementRef, Input, ContentChild, AfterViewInit, QueryList, forwardRef,
  OnChanges, Renderer2
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
  @ContentChild('fileButton') button: any;
  @Input() multiple: boolean;
  @Input() accept: string;
  @Input() capture: string = null;
  files: ExpandedFiles[];
  private disabled = false;
  private buttonNativeElement: any;
  propagateChange: any = () => { };
  constructor(
    private fileReaderService: FileReaderService,
    private renderer2: Renderer2
  ) { }

  ngAfterViewInit() {
    this.buttonNativeElement = this.button.nativeElement || this.button._elementRef.nativeElement;
    try {
      this.buttonNativeElement.onclick = (e: MouseEvent) => (!this.disabled) ? this.fileSelector.nativeElement.click() : null;
    } catch (e) {
      throw new Error('FILE-INPUT => El elemento no tiene "_elementRef.nativeElement" ni es un "nativeElement"' + e.message);
    }
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
    // Esto falla, si se llama al is disabled antes de que se cargue el botón.
    try {
      // Nombre de la clase que se va a añadir
      const DISABLED = 'disabled';
      if (isDisabled) {
        this.renderer2.setAttribute(this.buttonNativeElement, DISABLED, 'true');
      } else {
        this.renderer2.removeAttribute(this.buttonNativeElement, DISABLED);
      }
    } catch (e) {
      console.error(`FILE-INPUT => Se ha tratado de deshabilitar el botón del file selector antes de que se inicialice la vista`);
    }
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
