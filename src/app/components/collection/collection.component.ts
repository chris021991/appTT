import { Component, OnInit } from '@angular/core';
import { Collection } from '../../models/interfaces';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {

  // intentar el uso del input, temporal con variable en servicio
  // @Input() collection: Collection;
  path: 'collections';
  collection: Collection;
  photos = [];
  photo: string;

  constructor(private database: FirestoreService,
              public modalCtrl: ModalController) { }

  ngOnInit() {
    this.getPhotos();
  }

  getPhotos(){
    this.collection = this.database.collectionGeneral;
    this.photos = this.collection.photos;
  }

  photoView(index: number){
    this.database.indexPhotoGeneral = index;
    this.photo = this.collection.photos[index];
    console.log('Este es el índice -->', this.database.indexPhotoGeneral);
    console.log('Esta es la imagen -->', this.photo);
    this.modalCtrl.create({
      component: CollectionComponent
    }).then(m => m.present());
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

}
