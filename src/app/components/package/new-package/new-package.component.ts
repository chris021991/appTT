import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-new-package',
  templateUrl: './new-package.component.html',
  styleUrls: ['./new-package.component.scss'],
})
export class NewPackageComponent implements OnInit {

  locations = [
    { name: 'Estudio fotográfico o exterior', isChecked: false },
    { name: 'Estudio fotográfico y exterior', isChecked: false }
  ];

  prices = [
    { name: 'Fotógrafo Nivel 1', val: null},
    { name: 'Fotógrafo Nivel 2', val: null},
    { name: 'Fotógrafo Nivel 3', val: null}
  ];

  genre: any = null;
  package = '';
  photographerLevel: '';
  duration = '';
  digitalPhotos = '';
  phisicalPhotos = '';
  photobook = 'No';
  clothing = '';

  constructor(private navParams: NavParams,
              private afs: AngularFirestore,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.genre = this.navParams.get('genre');
    console.log(this.genre);
  }

  onSave() {
    const packageId = this.afs.createId();
    const ref = this.afs.collection('photo_genres').doc(this.genre.id).collection('packages').doc(packageId).set({
      id: packageId,
      name: this.package,
      duration: this.duration,
      digitalPhotos: this.digitalPhotos,
      phisicalPhotos: this.phisicalPhotos,
      photobook: this.photobook,
      clothing: this.clothing,
      locations: this.locations,
      prices: this.prices
      })
    .then(() => {
      window.alert('Guardado');
      this.close();
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
