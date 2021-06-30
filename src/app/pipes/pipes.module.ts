import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePipe } from './image.pipe';
import { SearchPipe } from './search.pipe';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { SearchCollectionPipe } from './search-collection.pipe';



@NgModule({
  declarations: [
    ImagePipe,
    SearchPipe,
    ImageSanitizerPipe,
    SearchCollectionPipe],
  exports: [
    ImagePipe,
    SearchPipe,
    ImageSanitizerPipe,
    SearchCollectionPipe],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
