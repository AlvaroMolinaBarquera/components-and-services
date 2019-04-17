import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { KEY_CODES } from './key-codes.const';

const DECIMAL_SEPARATOR = '.';
const SUBSTRACT = '-';
const DEFAULT_MAX_DECIMALS = 2;
const DEFAULT_MAX_INTEGERS = 12;
const DEFAULT_MAXLENGTH = 15;
const ALT_GR_KEY = 'AltGraph';

@Directive({
  selector: '[OnlyNumbers]'
})
export class OnlyNumbersDirective implements AfterViewInit {
  /** Controla que solo permita positivos */
  @Input('OnlyPositives') onlyPositives: boolean = false;
  /** Controla que solo permita numeros enteros */
  @Input('OnlyIntegers') onlyIntegers: boolean;
  /** Maximo de enteros */
  @Input('MaxDecimals') maxDecimals: number;
  /** Maximo de decimales */
  @Input('MaxIntegers') maxIntegers: number;
  private maxlength: number;
  /** Controla si tiene AltGr pulsado */
  private altGrIsPressed = false;
  /**
   * Expresión regular con todos los caracteres especiales que se pueden crear pulsando AltGr y una serie de botones
   * @example AltGr + 43 crea #.
   */
  private invalidAltGrCharacters = new RegExp('[#~@€~|¬]', 'g');
  constructor(private el: ElementRef, private control: NgControl) { }

  ngAfterViewInit() {
    this.maxDecimals = this.maxDecimals || DEFAULT_MAX_DECIMALS;
    this.maxIntegers = this.maxIntegers || DEFAULT_MAX_INTEGERS;
    const maxlength = this.el.nativeElement.getAttribute('maxlength');
    this.maxlength = (maxlength) ? Number(maxlength) : DEFAULT_MAXLENGTH;
  }

  @HostListener('keyup', ['$event']) onkeyup() {
    const e = <KeyboardEvent>event;
    if (e.key === ALT_GR_KEY) {
      this.altGrIsPressed = false;
    }
    // Controlamos, que al producirse un evento de KEYUP.
    // No se introduzcan los caracteres especiales, indicados en la expresión regular
    // que NO DISPARAN los eventos de pulsar el teclado. Pero que se pueden poner introduciendo
    // un patrón de combinación manteniendo AltGr pulsado.
    if (this.control.control.value) {
      let value = this.control.control.value;
      if (this.invalidAltGrCharacters.test(value)) {
        this.control.control.setValue(value.replace(this.invalidAltGrCharacters, ''));
        value = this.control.control.value;
      }
    }

  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const cursorPosition = (<HTMLInputElement>this.el.nativeElement).selectionStart;
    const e = <KeyboardEvent>event;
    if (e.key === ALT_GR_KEY) {
      this.altGrIsPressed = true;
    }
    const standarAllowed = [
      KEY_CODES.DELETE,
      KEY_CODES.BACKSPACE,
      KEY_CODES.TAB,
      KEY_CODES.ENTER,
      KEY_CODES.LEFT_ARROW,
      KEY_CODES.RIGTH_ARROW,
      KEY_CODES.END,
      KEY_CODES.HOME
    ];
    if (!this.onlyIntegers) {
      standarAllowed.push(KEY_CODES.DECIMAL_POINT, KEY_CODES.DOT);
    }
    if (!this.onlyPositives) {
      standarAllowed.push(KEY_CODES.NUMPAD_SUBTRAC, KEY_CODES.SLASH);
    }
    // Comprueba que no permite escribir puntos al incio
    if ((e.keyCode === KEY_CODES.DECIMAL_POINT || e.keyCode === KEY_CODES.DOT) && cursorPosition === 0) {
      e.preventDefault();
    }
    // Si hay más de "X decimales" evitamos que escriba más
    if (this.control.control.value) {
      const value = this.control.control.value;
      const indexOfDecimal = value.indexOf(DECIMAL_SEPARATOR);
      const indexOfSubstract = value.indexOf(SUBSTRACT);
      /** Mximo de enteros, no se cuenta el "-" por lo que si tiene un "-" se suma uno a la longitud total */
      const maxIntegers = this.maxIntegers + ((indexOfSubstract > -1) ? 1 : 0);
      /** Maxima longitud, no se cuenta el "-" por lo que si tiene un "-" se suma uno a la longitud total */
      const maxlength = this.maxlength + ((indexOfSubstract > -1) ? 1 : 0);
      // aceptamos solo N enteros y dos decimales pero permitimos el punto del decimal,
      // el retroceso, inicio, fin, tabulación, suprimir a partir de la posicion 12
      if (
        (value.length >= maxIntegers) &&
        (
          standarAllowed.indexOf(e.keyCode) === -1 &&
          !(indexOfDecimal > -1)
        )
      ) {
        e.preventDefault();
      }
      // No se permiten más de longitud X
      if (value.length >= maxlength && standarAllowed.indexOf(e.keyCode) === -1) {
        e.preventDefault();
      }

      // Si pulsa el BORRAR o SUPRIMIR
      if (e.keyCode === KEY_CODES.BACKSPACE || e.keyCode === KEY_CODES.DELETE) {
        // Y hay separador decimal
        if (indexOfDecimal > -1) {
          // Comprobamos que se intenta borrar el PUNTO,  ya sea pulsando el SUPRIMIR o el DELETE
          if (
            ((e.keyCode === KEY_CODES.BACKSPACE) && (indexOfDecimal === (cursorPosition - 1))) ||
            ((e.keyCode === KEY_CODES.DELETE) && (indexOfDecimal === cursorPosition))
          ) {
            // Si se intenta borrar el punto comprobamos la longitud de los enteros.
            const integers = value.substr(0, indexOfDecimal).length;
            const decimals = value.substring(indexOfDecimal + 1).length;
            // Sumamos DECIMALES + ENTEROS. Y si supera los enteros. Evitamos el
            if ((integers + decimals) > maxIntegers) {
              e.preventDefault();
            }
          }
        }
      }

      // Comprobamos si estamos tratando de añadir un "-" en cualquier otra posición que no sea el principio
      if ((e.keyCode === KEY_CODES.NUMPAD_SUBTRAC || e.keyCode === KEY_CODES.SLASH) && cursorPosition !== 0) {
        e.preventDefault();
      }
      // Logica a aplicar en caso de que vengan decimales
      if (indexOfDecimal > -1) {
        // Evita que se escriban más de X Decimales
        if (
          value.substring(indexOfDecimal).length > this.maxDecimals &&
          this.isNum(e.keyCode) &&
          cursorPosition > indexOfDecimal
        ) {
          e.preventDefault();
        }
        // Evita que se pulse el botón de '.' más de una vez
        if (e.keyCode === KEY_CODES.DOT || e.keyCode === KEY_CODES.DECIMAL_POINT) {
          e.preventDefault();
        }
      }
    }
    if (standarAllowed.indexOf(e.keyCode) !== -1 ||
      // Permite: Ctrl+A
      (e.keyCode === KEY_CODES.A && (e.ctrlKey || e.metaKey)) ||
      // Permite: Ctrl+C
      (e.keyCode === KEY_CODES.C && (e.ctrlKey || e.metaKey)) ||
      // Permite: Ctrl+V
      (e.keyCode === KEY_CODES.V && (e.ctrlKey || e.metaKey)) ||
      // Permite: Ctrl+X
      (e.keyCode === KEY_CODES.X && (e.ctrlKey || e.metaKey)) ||
      // Permite: home, end, left, right
      (e.keyCode >= KEY_CODES.END && e.keyCode <= KEY_CODES.RIGTH_ARROW)) {
      return;
    }
    // Si no es un numero o es un numero pero se está pulsando alguna tecla especial.
    // Se previene el evento
    if (
      (!this.isNum(e.keyCode) ||
      (this.isNum(e.keyCode) && (e.ctrlKey || e.metaKey || e.altKey || this.altGrIsPressed)))
    ) {
      e.preventDefault();
    }
  }

  private isNum(keyCode: number) {
    return ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105));
  }
}
