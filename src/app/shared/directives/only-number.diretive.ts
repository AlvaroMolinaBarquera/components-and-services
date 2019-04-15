import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';
const DECIMAL_SEPARATOR = '.';
const DEFAULT_MAX_DECIMALS = 2;
const DEFAULT_MAX_INTEGERS = 12;
const DEFAULT_MAXLENGTH = 15;

@Directive({
  selector: '[OnlyNumbers]'
})
export class OnlyNumbersDirective implements AfterViewInit {
  @Input('OnlyIntegers') onlyIntegers: boolean;
  @Input('MaxDecimals') maxDecimals: number;
  @Input('MaxIntegers') maxIntegers: number;
  private maxlength: number;
  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.maxDecimals = this.maxDecimals || DEFAULT_MAX_DECIMALS;
    this.maxIntegers = this.maxIntegers || DEFAULT_MAX_INTEGERS;
    const maxlength = this.el.nativeElement.getAttribute('maxlength');
    this.maxlength = (maxlength) ? Number(maxlength) : DEFAULT_MAXLENGTH;
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;
    const standarAllowed = [
      // DELETE
      46,
      // Backspace
      8,
      // tab
      9,
      // Enter
      13
    ];
    if (!this.onlyIntegers) {
      standarAllowed.push(
        // Decimal Point
        110,
        // Dot
        190);
    }
    // Si hay más de "X decimales" evitamos que escriba más
    if (this.el.nativeElement.value) {
      const value = this.el.nativeElement.value;
      const indexOfDecimal = value.indexOf(DECIMAL_SEPARATOR);
      const cursorPosition = (<HTMLInputElement>this.el.nativeElement).selectionStart;
      // aceptamos solo N enteros y dos decimales pero permitimos el punto del decimal,
      // el retroceso, inicio, fin, tabulación, suprimir a partir de la posicion 12
      if (
        (value.length >= this.maxIntegers) &&
        (
          (e.keyCode !== 190) &&
          (e.keyCode !== 8) &&
          (e.keyCode !== 46) &&
          (e.keyCode !== 9) &&
          (e.keyCode !== 37) &&
          (e.keyCode !== 39) &&
          !((indexOfDecimal > -1))
          // permite mayúsculas inicio, mayúsculas fin
          && !((e.keyCode >= 35) && (e.keyCode <= 36))
        )
      ) {
        e.preventDefault();
      }
      // No se permiten más de longitud X
      if (value.length === this.maxlength && standarAllowed.indexOf(e.keyCode) === -1) {
        e.preventDefault();
      }

      // Logica a aplicar en caso de que vengan decimales
      if (indexOfDecimal > -1) {
        // Evita que se escriban más de X Decimales
        if (

          value.substring(indexOfDecimal).length > this.maxDecimals &&
          ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) &&
          cursorPosition > indexOfDecimal
        ) {
          e.preventDefault();
        }
        // Evita que se pulse el botón de '.' más de una vez 
        if (e.keyCode === 110 || e.keyCode === 190) {
          e.preventDefault();
        }
      }
    }
    if (standarAllowed.indexOf(e.keyCode) !== -1 ||
      // Permite: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Permite: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Permite: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Permite: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Permite: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // solo permite numéricos
    if (((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105))
      // para evitar AltGr + Numéricos
      || (((e.keyCode > 48) && (e.keyCode < 57)) && (e.ctrlKey || e.metaKey || e.altKey))
      || ((((e.keyCode > 96) && (e.keyCode < 105))) && (e.ctrlKey || e.metaKey || e.altKey))) {
      e.preventDefault();
    }

  }
}