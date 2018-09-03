export interface DetailAction {
    /** Referencia al componente, debe estar declarado en "EntryComponents" */
    component: any;
    /**
     * Función que devuelve un observable, a ejecutar antes de crear el componente.
     * El observable debe devolver un objeto bindings.
     */
    action?: Function;
    /** Objetos con clave valor donde "clave" es el nombre del binding y el valor es el dato a pasarle */
    bindings?: any;
}

export interface IconAction {
    /**
     *  Icono, solo se aplica el nombre del icono por ejemplo si estamos usando 
     *  FontAwesome, que se declara como "fas fa-abacus" solo tendriamos que pasarle "abacus"
     */
    icon: string;
    /** Acción que se ejecutará despues de clickear el icono, recibe como parametro la fila de la tabla */
    action: Function;
}

export interface TextAction {
    /**
     * Texto a mostrar
     */
    text: string;
    /** Acción que se ejecutará despues de clickear el icono, recibe como parametro la fila de la tabla */
    action: Function;
}
