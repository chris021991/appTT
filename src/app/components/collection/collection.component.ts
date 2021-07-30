import { Component, OnInit } from '@angular/core';
import { Collection } from '../../models/interfaces';
import { ModalController, LoadingController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
import { PhotoSliderComponent } from '../photo-slider/photo-slider.component';

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
              public modalCtrl: ModalController,
              private loadingCtrl: LoadingController) {
                this.loadingCtrl.create({
                  message: 'Cargando...'
                }).then(loading => loading.present());
               }

  ngOnInit() {
    this.getPhotos();
  }

  ionViewDidEnter(){
    this.loadingCtrl.dismiss();
  }

  getPhotos(){
    this.collection = this.database.collectionGeneral;
    this.photos = this.collection.photos;
  }

  // openPhoto( photo: Photo ) {
  //   this.database.photoTemp = photo;
  //   this.route.navigate(['/dashboard/app/home/photo']);
  // }

  photoView(index: number){
    // this.database.indexPhotoGeneral = index;
    // this.photo = this.collection.photos[index];
    // this.database.photoTemp = photo;
    // console.log('Este es el índice -->', this.database.indexPhotoGeneral);
    // console.log('Esta es la imagen -->', this.photo);
    console.log('Este es el índice -->', index);
    console.log('Esta es la imagen -->', this.photos[index]);
    this.modalCtrl.create({
      component: PhotoSliderComponent,
      componentProps: {
        collection: this.collection,
        index
      }
    }).then(m => m.present());
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

}
