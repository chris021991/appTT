import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePipe } from './image.pipe';
import { SearchPipe } from './search.pipe';



@NgModule({
  declarations: [ImagePipe, SearchPipe],
  exports: [ImagePipe, SearchPipe],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
