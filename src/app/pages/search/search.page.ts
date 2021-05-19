import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { returnDocuments } from '../../helpers/return-documents';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  textSearch = '';
  users: User[] = [];
  private path = 'users';
  enable = true;
  lastDocument: any = null;
  page = 'search';
  advanced = false;
  genres: any;
  cities = [
    'Guayaquil',
    'Quito',
    'Cuenca',
    'Santo Domingo',
    'Machala',
    'Durán',
    'Manta',
    'Portoviejo',
    'Ambato',
    'Riobamba',
    'Quevedo',
    'Loja',
    'Ibarra',
    'Milagro',
    'Esmeraldas',
    'La Libertad',
    'Babahoyo',
    'Tulcán',
    'Sangolquí',
    'Latacunga',
    'Pasaje',
    'Chone',
    'Santa Rosa',
    'Huaquillas',
    'Nueva Loja',
    'El Carmen',
    'Jipijapa',
    'Ventanas',
    'Daule',
    'Cayambe',
    'Otavalo',
    'Velasco Ibarra',
    'Azogues',
    'Santa Elena',
    'Salinas',
    'La Troncal',
    'Buena Fe'
  ];

  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.users = [];
    this.loadData();
    this.afs.collection('photo_genres').valueChanges().subscribe((genres) => {
      this.genres = genres;
    });
  }

  async loadData(event?) {

    const data = await this.getPhotographers<User>(this.path);

    this.users.push( ...data );

    if ( event ) {
      event.target.complete();
      if ( data.length === 0 ) {
        this.enable = false;
      }
    }
  }

  doRefresh( event ){
    this.users = [];
    this.lastDocument = null;
    this.enable = true;
    this.loadData( event );
  }

  private getPhotographers<tipo>(path: string) {
    const itemsCollection = this.afs.collection<tipo>(path);

    const query = itemsCollection.ref
                                    .where('role', '==', 'PHOTOGRAPHER')
                                    .orderBy('displayName')
                                    .startAfter(this.lastDocument);

    return query.limit(10).get().then( snap => {
      this.lastDocument = snap.docs[ snap.docs.length - 1 ] || null;
      return returnDocuments(snap);
    });
  }

  advancedSearch() {
    if (!this.advanced) {
      this.advanced = true;
    } else {
      this.advanced = false;
    }
  }

  search( event ){
    const text = event.target.value;
    this.textSearch = text;
    console.log(text);
  }

}
