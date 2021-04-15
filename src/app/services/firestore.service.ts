import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Collection, User } from '../models/interfaces';
import { returnDocuments } from '../helpers/return-documents';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  collectionGeneral: Collection;
  indexPhotoGeneral: number;
  lastDocument: any = null;
  userTemp: User = null;
  photoTemp = '';

  constructor(public angularFirestore: AngularFirestore) { }

  createId(){
    return this.angularFirestore.createId();
  }

  createDocument<tipo>(data: tipo, path: string, id: string) {
    const itemsCollection = this.angularFirestore.collection<tipo>(path);
    return itemsCollection.doc(id).set(data);
  }

  getDocument<tipo>(path: string, id: string) {
    const itemsCollection = this.angularFirestore.collection<tipo>(path);
    return itemsCollection.doc(id).valueChanges();
  }

  deleteDocument<tipo>(path: string, id: string){
    const itemsCollection = this.angularFirestore.collection<tipo>(path);
    return itemsCollection.doc(id).delete();
  }

  updateDocument<tipo>(data: tipo, path: string, id: string) {
    const itemsCollection = this.angularFirestore.collection<tipo>(path);
    return itemsCollection.doc(id).update(data);
  }

  getCollectionChanges<tipo>(path: string): Observable<tipo[]>{
    const itemsCollection = this.angularFirestore.collection<tipo>(path);
    return itemsCollection.valueChanges();
  }


  getPhotographers<tipo>(path: string) {
    const itemsCollection = this.angularFirestore.collection<tipo>('users');

    const query = itemsCollection.ref
                                    .where('role', '==', 'PHOTOGRAPHER')
                                    .orderBy('displayName')
                                    .startAfter(this.lastDocument);

    return query.limit(10).get().then( snap => {
      this.lastDocument = snap.docs[ snap.docs.length - 1 ] || null;
      return returnDocuments(snap);
    });
  }

}
