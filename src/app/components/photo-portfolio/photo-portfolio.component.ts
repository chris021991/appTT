import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CameraService } from '../../services/camera.service';
import { FirestorageService } from '../../services/firestorage.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { User } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { Image } from '../../models/image.interface';

declare var window: any;

@Component({
  selector: 'app-photo-portfolio',
  templateUrl: './photo-portfolio.component.html',
  styleUrls: ['./photo-portfolio.component.scss'],
})

export class PhotoPortfolioComponent implements OnInit {

  userLogged: User;
  tempImages: string[] = [];
  imagePath = 'PortfolioImages';
  uid = 'prueba';

  retSvc = [];


  constructor(private fireStorage: FirestorageService,
              private database: FirestoreService,
              private authSvc: AuthService,
              private cameraSvc: CameraService,
              private imagePicker: ImagePicker,
              private actionSheetCtrl: ActionSheetController,
              private modalCtrl: ModalController) { }

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
    const temp = await this.fireStorage.uploadImages(this.tempImages, this.imagePath, this.uid);
    this.retSvc = temp;
    console.log('RetSvc ->', this.retSvc);
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

  // intentar trabajar con PopOver, problemas al recibir info de component
  // async presentPopover(ev: any) {
  //   const popover = await this.popoverCtrl.create({
  //     component: PopoverPortfolioComponent,
  //     event: ev,
  //     translucent: true
  //   });
  //   await popover.present();

  //   const { data } = await popover.onWillDismiss();
  //   this.image = data;
  // }
}
