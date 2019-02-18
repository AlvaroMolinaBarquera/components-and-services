
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FileReaderService } from './file-reader/file-reader.service';
import { FileInputComponent } from './file-input/file-input.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    FileInputComponent,
  ],
  declarations: [
    FileInputComponent
  ],
  providers: [ FileReaderService ]
})
export class FilesModule { }
