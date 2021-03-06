import { Pipe, PipeTransform } from '@angular/core';
import { Collection } from '../models/interfaces';

@Pipe({
  name: 'searchCollection'
})
export class SearchCollectionPipe implements PipeTransform {

  transform(items: Collection[], text: string): Collection[] {
    if (text.length === 0 ) {return items; }

    text = text.toLocaleLowerCase();

    return items.filter( item => {
      return item.name.toLocaleLowerCase().includes(text);
    });

  }
}
