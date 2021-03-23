import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { Collection } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  collectionGeneral: Collection;
  indexPhotoGeneral: number;

  constructor(public angularFirestore:AngularFirestore) { }

  createId(){
    return this.angularFirestore.createId();
  }

  createDocument<tipo>(data: tipo, path:string, id: string) {
    const itemsCollection = this.angularFirestore.collection<tipo>(path);
    return itemsCollection.doc(id).set(data);
  }

  getDocument<tipo>(path:string, id: string) {
    const itemsCollection = this.angularFirestore.collection<tipo>(path);
    return itemsCollection.doc(id).valueChanges();
  }

  deleteDocument<tipo>(path: string, id: string){
    const itemsCollection = this.angularFirestore.collection<tipo>(path);
    return itemsCollection.doc(id).delete();
  }

  updateDocument<tipo>(data: tipo, path:string, id: string) {
    const itemsCollection = this.angularFirestore.collection<tipo>(path);
    return itemsCollection.doc(id).update(data);
  }

  getCollectionChanges<tipo>(path:string): Observable<tipo[]>{
    const itemsCollection = this.angularFirestore.collection<tipo>(path);
    return itemsCollection.valueChanges();
  }
  
}
