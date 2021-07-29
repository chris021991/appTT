import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { CameraService } from '../../../services/camera.service';
import { User } from '../../../models/interfaces';
import { FirestorageService } from '../../../services/firestorage.service';
import { FirestoreService } from '../../../services/firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

declare var window: any;

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss'],
})
export class NewCollectionComponent implements OnInit {

  tempImages: string[] = [];
  path = 'collections';
  userLogged: User;
  id: string;
  name: string;
  date = Date.now();
  description: string;
  client: string;

  constructor(private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private cameraSvc: CameraService,
              private fireStorage: FirestorageService,
              private database: FirestoreService,
              private afs: AngularFirestore,
              private authSvc: AuthService,
              private imagePicker: ImagePicker) { }

  ngOnInit() {
    this.authSvc.user$.subscribe( userLogged => {
      this.userLogged = userLogged;
    });

    this.imagePicker.hasReadPermission().then((val) => {
      if (val === false) {
        this.imagePicker.requestReadPermission();
      }
    }, (err) => {
      this.imagePicker.requestReadPermission();
    });
  }

  async createCollection() {
    this.getId();
    this.afs.collection(this.path).doc(this.id).set({
      id: this.id,
      name: this.name,
      client: this.client,
      date: this.date,
      des: this.description,
      photographer: this.userLogged.uid
    });
    for (const image of this.tempImages) {
      const img = await this.fireStorage.uploadImage(image, this.path, this.userLogged.uid);
      const idPhoto = Date.now() + '_' + this.id;
      this.afs.collection(this.path).doc(this.id).collection('photo').doc(idPhoto).set({
        id: idPhoto,
        photographer: this.userLogged.uid,
        uploadAt: Date.now(),
        img
      });
    }

    this.close();

    // this.userLogged.photosPortfolio = this.photosPortfolioURL;
    // this.database.updateDocument(this.userLogged, 'users', this.userLogged.uid)
    // .then(() => {
    //   this.closeModal();
    // });
  }

  deleteFirestore(uid: string, id: string) {
    this.afs.collection('users').doc(uid).collection('photosPortfolio').doc(id).delete();
  }

  deleteTemp(image) {
    const index = this.tempImages.indexOf(image);
    this.tempImages.splice(index, 1);
  }

  onCamera() {
    this.cameraSvc.openCamera()
    .then((imageData) => {
     const img = window.Ionic.WebView.convertFileSrc('data:image/jpg;base64,' + imageData);
     this.tempImages.push(img);
     console.log(this.tempImages);
    }, (err) => {
     // Handle error
    });
  }

  onLibrary() {
    this.cameraSvc.openLibrary()
    .then((results) => {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < results.length; i++) {
        // console.log('Image URI: ' + results[i]);
        const img = window.Ionic.WebView.convertFileSrc('data:image/jpg;base64,' + results[i]);
        this.tempImages.push(img);
      }
    }, (err) => {
      // Handle error
    });
  }

  getId(){
    this.id = this.database.createId();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Subir imagen',
      buttons: [{
        text: 'Tomar fotografía',
        icon: 'camera-outline',
        handler: () => {
          console.log('Tomar fotografía clicked');
          this.onCamera();
        }
      }, {
        text: 'Biblioteca',
        icon: 'images-outline',
        handler: () => {
          console.log('Biblioteca clicked');
          this.onLibrary();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
