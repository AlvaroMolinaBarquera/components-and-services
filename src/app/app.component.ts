import { Component, INJECTOR } from '@angular/core';
import { Http } from '@angular/http';
import { EntryComponent } from './shared/entry/entry.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  source;
  columns;
  form: FormGroup;
  constructor(
    private http: Http,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      attachments: [],
    });
    // this.form.get('attachments').disable();
    this.form.valueChanges.subscribe((data) => {
      this.form.get('attachments').disable({emitEvent: false});
      setTimeout(() => {
        console.log('Habilitado')
        this.form.get('attachments').enable({emitEvent: false});
      }, 3000);
      console.log('El formulario ha cambiado =>', data);
    });

    const actions = [
      {
        text: 'Prueba', action: this.normalAction
      },
      {
        component: EntryComponent, bindings: {entry: 'hey piel suave'},
      },
      {
        component: EntryComponent, action: this.observableAction,
      },
      {
        icon: 'example', action: this.normalAction,
      }
    ];
    this.columns = [
      {key: 'name', text: 'Nombre'},
      {key: 'adress', text: 'Direccion'},
    ];
    this.source = [
      {name: 'Jose Antonio', adress: 'LBK', actions: actions},
      {name: 'Andres', adress: 'Getafe', actions: actions},
      {name: 'Alvaro', adress: 'Parla', actions: actions}
    ];

  }

  normalAction = (row) => {
    console.log(row);
  }

  observableAction = (row) => {
    const http$ = this.http.get('https://jsonplaceholder.typicode.com/posts/1');
    return http$.pipe(
      (
        map(
          (data) => {
            return { entry: 'Entrada Normal', observableEntry: JSON.stringify(data.json()) };
          }
        )
      )
    );
  }
}
