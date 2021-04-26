import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-package',
  templateUrl: './new-package.component.html',
  styleUrls: ['./new-package.component.scss'],
})
export class NewPackageComponent implements OnInit {

  constructor(private afs: AngularFirestore,
              private modalCtrl: ModalController) { }

  val1 = true;
  val2 = false;

  locations = [
    { name: 'Solo estudio fotográfico', isChecked: false },
    { name: 'Solo exterior', isChecked: false },
    { name: 'Estudio fotográfico y exterior', isChecked: false }
  ];

  prices = [
    { name: 'Fotógrafo Nivel 1', val: null},
    { name: 'Fotógrafo Nivel 2', val: null},
    { name: 'Fotógrafo Nivel 3', val: null},
  ];

  genre = '';
  package = '';
  photographerLevel: '';
  duration = '';
  digitalPhotos = '';
  phisicalPhotos = '';
  photobook: boolean;
  clothing = '';

  ngOnInit() {}

  onSave() {
    const ref = this.afs.collection('photo_genres').doc(this.genre.toLocaleLowerCase());
    ref.set({
      id: this.genre.toLocaleLowerCase(),
      name: this.genre,
    }, {merge: true})
    .then(() => {
      ref.collection('packages').doc(this.package.toLocaleLowerCase()).set({
        id: this.package.toLocaleLowerCase(),
        name: this.package,
        duration: this.duration,
        digitalPhotos: this.digitalPhotos,
        phisicalPhotos: this.phisicalPhotos,
        photobook: this.photobook,
        clothing: this.clothing,
        locations: this.locations,
        prices: this.prices
      });
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
