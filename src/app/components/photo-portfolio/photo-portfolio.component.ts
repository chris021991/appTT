import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CameraService } from '../../services/camera.service';
import { FirestorageService } from '../../services/firestorage.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { User, Photo } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '../../services/firestore.service';

declare var window: any;

@Component({
  selector: 'app-photo-portfolio',
  templateUrl: './photo-portfolio.component.html',
  styleUrls: ['./photo-portfolio.component.scss'],
})

export class PhotoPortfolioComponent implements OnInit {

  userLogged: User;
  tempImages: string[] = [];
  photosPortfolio: Photo[];
  imagePath = 'photosPortfolio';

  constructor(private fireStorage: FirestorageService,
              private database: FirestoreService,
              private afs: AngularFirestore,
              private authSvc: AuthService,
              private cameraSvc: CameraService,
              private imagePicker: ImagePicker,
              private actionSheetCtrl: ActionSheetController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.authSvc.user$.subscribe( userLogged => {
      this.userLogged = userLogged;
      this.database.getPhotosPortfolio(userLogged.uid).subscribe((res) => {
        this.photosPortfolio = res;
      });
    });

    this.imagePicker.hasReadPermission().then((val) => {
      if (val === false) {
        this.imagePicker.requestReadPermission();
      }
    }, (err) => {
      this.imagePicker.requestReadPermission();
    });
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

  async uploadImages() {
    for (const image of this.tempImages) {
      const img = await this.fireStorage.uploadImage(image, this.imagePath, this.userLogged.uid);
      const idPhoto = Date.now() + '_' + this.userLogged.uid;
      this.afs.collection('users').doc(this.userLogged.uid).collection('photosPortfolio').doc(idPhoto).set({
        id: idPhoto,
        createdBy: this.userLogged.uid,
        createdAt: Date.now(),
        img
      });
    }

    this.closeModal();

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

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
