import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, IonSlides, LoadingController } from '@ionic/angular';
import { Photo, Collection, User } from '../../models/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-photo-slider',
  templateUrl: './photo-slider.component.html',
  styleUrls: ['./photo-slider.component.scss'],
})
export class PhotoSliderComponent implements OnInit {

  @ViewChild('slides') slides: IonSlides;

  user: User;
  collection: Collection;
  photos: string[];
  index: number;
  viewEntered = false;

  constructor(private modalCtrl: ModalController,
              private navParams: NavParams,
              private afs: AngularFirestore,
              private loadingCtrl: LoadingController) {
                this.loadingCtrl.create({
                  message: 'Cargando...'
                }).then(loading => loading.present());
              }

  ngOnInit() {
    this.index = this.navParams.get('index');
    console.log(this.index);
    this.collection = this.navParams.get('collection');
    this.afs.collection('users').doc(this.collection.photographer).valueChanges().subscribe((res) => {
      this.user = res;
    });
    this.photos = this.collection.photos;
  }

  ionViewDidEnter(){
    this.viewEntered = true;
    this.loadingCtrl.dismiss();
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  onClick() {}

}
