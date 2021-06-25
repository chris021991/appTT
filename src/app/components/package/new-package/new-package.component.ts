import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-new-package',
  templateUrl: './new-package.component.html',
  styleUrls: ['./new-package.component.scss'],
})
export class NewPackageComponent implements OnInit {

  @Input() package: any;
  @Input() title = '';

  locations = [
    { name: 'Estudio fotográfico o exterior', isChecked: false },
    { name: 'Estudio fotográfico y exterior', isChecked: false }
  ];

  prices = [
    { name: 'Fotógrafo Nivel 1', val: null},
    { name: 'Fotógrafo Nivel 2', val: null},
    { name: 'Fotógrafo Nivel 3', val: null}
  ];

  packageId = '';
  genre: any = null;
  name = '';
  description = '';
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
    if (this.package) {
      this.packageId = this.package.id;
      this.name = this.package.name;
      this.description = this.package.description;
      this.duration = this.package.duration;
      this.digitalPhotos = this.package.digitalPhotos;
      this.phisicalPhotos = this.package.phisicalPhotos;
      this.photobook = this.package.photobook;
      this.clothing = this.package.clothing;
      this.prices = this.package.prices;
      this.locations = this.package.locations;
    }
  }

  onSave() {
    if (!this.package) {
      this.packageId = this.afs.createId();
    }
    const ref = this.afs.collection('photo_genres').doc(this.genre.id).collection('packages').doc(this.packageId).set({
      id: this.packageId,
      name: this.name,
      description: this.description,
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
