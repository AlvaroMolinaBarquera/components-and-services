import { Component, OnInit, Input,
  EventEmitter, Output, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { TableDetailDirective } from './table-detail/table-detail.directive';
import { ColumnsSource } from './models/columns-source.model';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: [ './data-table.component.css' ]
})
export class DataTableComponent implements OnInit {

    /** Cabecera de la tabla */
    @Input() columnsSource: ColumnsSource[];
    /** Datos de la tabla */
    @Input() dataSource: any[];
    /** Directiva sobre la cual se va a escribir el componente */
    @ViewChild(TableDetailDirective) viewDetail: TableDetailDirective;
    /** indica si la tabla tiene "acciones" */
    hasActions: boolean;
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit(): void {
      this.hasActions = this.checkHasActions(this.dataSource);
    }

    /** Comprueba si tiene "acciones" */
    checkHasActions(dataSource) {
      let hasActions = false;
      for (const row of this.dataSource) {
        if (row.actions) {
          hasActions = true;
          break;
        }
      }
      return hasActions;
    }
    /**
     * Abre la ventana de detalle
     * @param row Columna de la tabla
     * @param rowAction Acción que ha desatado el abrir el detalle
     */
    private openDetail = (row, rowAction) => {
      const status = row.detailExpanded;
      // Cerramos el detalle de las otras columnas
      for (const rowData of this.dataSource) { rowData.detailExpanded = false; }
      row.detailExpanded = !status;
      if (row.detailExpanded) {
        // Le dejamos un pequeño Timeout. Por que si no el viewDetail no detecta
        // el componente renderizado
        /** Referencia del componente */
        let componentRef = null;
        setTimeout(() => {
          // Si el componente tiene "action", se espera una función que devuelva un observable
          // Nos suscribimos al observable, que esperamos que devuelva un objeto de este estilo
          /** @example {nombreDelBinding: "valor", nombreDelBiding2: valor} */
          if (rowAction.action) {
            rowAction.action(row)
              .subscribe(
                (data) => {
                  componentRef = this.createComponent(rowAction);
                  this.applyBindings(componentRef, data);
                },
                (error) => {
                  console.error(`Se ha producido un error, se cierra el detalle ${JSON.stringify(error)}`);
                  row.detailExpanded = false;
                }
              );
          // Si hay bindings, se espera un objeto como el que devuelve el observable
          } else if (rowAction.bindings) {
            componentRef = this.createComponent(rowAction);
            this.applyBindings(componentRef, rowAction.bindings);
          } else {
            // Por ultimo, no se ha informaod ningun binding.
            console.info(`No se han informado bindings`);
          }
        }, 0);
      }
    }
    /**
     * Aplica los biding
     * @param componentRef Referencia del componente
     * @param bidings Objeto con los bidings
     */
    private applyBindings(componentRef, bindings) {
      const keys = Object.keys(bindings);
      for (const key of keys) {
        componentRef.instance[key] = bindings[key];
      }
    }
    /**
     * Crea el componente
     * @param rowAction Acción que ha desatado el componente
     * @return Referencia del componente
     */
    private createComponent(rowAction) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(rowAction.component);
      const viewContainerRef = this.viewDetail.viewContainerRef;
      viewContainerRef.clear();
      return viewContainerRef.createComponent(componentFactory);
    }
    /**
     *  Función auxiliar que comprueba si un valor es una función
     * @param functionToCheck Función a comprobar
     */
    private isFunction(functionToCheck) {
      return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
}
