import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { ExpandedFiles } from './../models/expanded-files';
@Injectable()
export class FileReaderService {

  constructor() { }
  /**
   *  Lee un fichero como Base64
   */
  readFilesAsBase64(files: FileList): Observable<ExpandedFiles[]> {
    const filesArray = Array.from(files);
    return forkJoin(filesArray.map(m => this.readFileAsBase64(m)));
  }

  readFileAsBase64(file: File): Observable<ExpandedFiles>  {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onerror = (error) => {
        observer.error(error);
        observer.complete();
      };
      reader.onload = (ev: any) => {
        const bytes = Array.from(new Uint8Array(ev.target.result));
        const base64StringFile = btoa(bytes.map((item) => String.fromCharCode(item)).join(''));
        observer.next({
          base64: base64StringFile,
          name: file.name,
          // Si que existe dentro de la interfaz "File" pero da error.
          // @ts-ignore
          lastModified: file.lastModified,
          type: file.type,
          size: file.size
        });
        observer.complete();
      };
    });
  }

}
