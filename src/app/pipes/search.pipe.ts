import { Pipe, PipeTransform } from '@angular/core';
import { Collection, User } from '../models/interfaces';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  // transform(items: Collection[], text: string): Collection[] {
  //   if (text.length === 0 ) {return items; }

  //   text = text.toLocaleLowerCase();

  //   return items.filter( item => {
  //     return item.name.toLocaleLowerCase().includes(text);
  //   });

    transform(items: User[], text: string): User[] {
      if (text.length === 0 ) {return items; }

      text = text.toLocaleLowerCase();

      return items.filter( item => {
        return item.displayName.toLocaleLowerCase().includes(text);
      });

  }

}
