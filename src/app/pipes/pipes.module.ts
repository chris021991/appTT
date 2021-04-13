import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePipe } from './image.pipe';
import { SearchPipe } from './search.pipe';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';



@NgModule({
  declarations: [
    ImagePipe,
    SearchPipe,
    ImageSanitizerPipe],
  exports: [
    ImagePipe,
    SearchPipe,
    ImageSanitizerPipe],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
