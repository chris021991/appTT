import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, LoadingController, ToastController, PickerController, ActionSheetController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { LocationService } from '../../../services/location.service';
import { User } from '../../../models/interfaces';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor( private authSrv: AuthService,
               private navCtrl: NavController,
               private loadingCtrl: LoadingController,
               private toastCtrl: ToastController,
               private route: Router,
               private camera: Camera,
               private afs: AngularFirestore,
               private firestorage: FirestorageService,
               private pickerCtrl: PickerController,
               private location: LocationService,
               private actionSheetCtrl: ActionSheetController) { }

  @ViewChild('slideWelcome') slides: IonSlides;

  user: User;
  uid: string;
  displayName: string;
  phone: number;
  biography: string;
  city: string;
  photoURL: string;
  coverPage: string;
  firstLogin: boolean;

  cities = [];
  photoStyles = [];

  imageCoverPage = 'assets/no-image-banner.jpg';
  image = 'assets/no-image-banner.jpg';
  imagePath = 'photoProfile';
  coverPagePath = 'coverPage';

  slideCount = 0;

  // cambiar por colección photo_genres
  // public photoStyle = [
  //   { val: 'Retrato', isChecked: false },
  //   { val: 'Bodas y compromisos', isChecked: false },
  //   { val: 'Eventos', isChecked: false },
  //   { val: 'Moda', isChecked: false },
  //   { val: 'Graduaciones', isChecked: false },
  //   { val: 'Deportes/Acción', isChecked: false },
  //   { val: 'Comercial/Editorial', isChecked: false },
  //   { val: 'Naturaleza/Fauna salvaje', isChecked: false },
  //   { val: 'Bellas artes', isChecked: false },
  //   { val: 'Fotoperiodismo', isChecked: false }
  // ];

  async ngOnInit() {
    this.authSrv.user$.subscribe(user => {
      this.uid = user.uid,
      this.displayName = user.displayName,
      this.phone = user.phone,
      this.biography = user.biography,
      this.city = user.city;
      this.photoURL = user.photoURL;
      this.coverPage = user.coverPage;
      this.firstLogin = user.firstLogin;
      // this.photoStyle = user.photoStyle;
    });
    this.getPhotoStyles();
    this.cities = this.location.cities;
  }

  getPhotoStyles() {
    this.afs.collection('photo_genres').valueChanges().subscribe(res => {
      this.photoStyles = res;
      console.log(this.photoStyles);
    });
  }

  // Corregir tamaño de arreglo cities
  async openPicker(numColumns = 1, numOptions = 37, columnOptions = this.cities){
    const picker = await this.pickerCtrl.create({
      columns: this.getColumns(numColumns, numOptions, columnOptions),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: (value) => {
            picker.onDidDismiss().then(async data => {
              const col = await picker.getColumn('col-0');
              this.city = col.options[col.selectedIndex].text;
            });
          }
        }
      ]
    });

    await picker.present();

  }

  getColumns(numColumns, numOptions, columnOptions) {
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }
    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions) {
    const options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      });
    }
    return options;
  }

  ionViewDidEnter() {
    this.slides.lockSwipes(true);
  }

  async addPhoto(source: string) {
    if (source === 'camera') {
      console.log('camera');
      const cameraPhoto = await this.openCamera();
      this.photoURL = 'data:image/jpg;base64,' + cameraPhoto;
    } else {
      console.log('library');
      const libraryImage = await this.openLibrary();
      this.photoURL = 'data:image/jpg;base64,' + libraryImage;
    }
  }

  async addCoverPage(source: string) {
    if (source === 'camera') {
      console.log('camera');
      const cameraPhoto = await this.openCamera();
      this.coverPage = 'data:image/jpg;base64,' + cameraPhoto;
    } else {
      console.log('library');
      const libraryImage = await this.openLibrary();
      this.coverPage = 'data:image/jpg;base64,' + libraryImage;
    }
  }

  async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    return await this.camera.getPicture(options);
  }

  async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    return await this.camera.getPicture(options);
  }

  async uploadPhotoProfile() {
    const photo = await this.firestorage.uploadImage(this.photoURL, this.imagePath, this.uid);
    this.photoURL = photo;
  }

  async uploadPhotoCoverPage(){
    const coverPage = await this.firestorage.uploadImage(this.coverPage, this.coverPagePath, this.uid);
    this.coverPage = coverPage;
  }

  async finish() {
    await this.uploadPhotoProfile();
    await this.uploadPhotoCoverPage();
    await this.updateUserData()
    .then(() => {
      this.navCtrl.navigateRoot('/dashboard/app/home', { animated: true });
    })
    .catch (error => {
      console.log(error);
      this.toast(error.message, 'danger');
    });
  }

  async updateUserData() {
    const loading = await this.loadingCtrl.create({
      message: 'Actualizando...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afs.collection('users').doc(this.uid).set({
      displayName: this.displayName,
      phone: this.phone,
      city: this.city,
      biography: this.biography,
      photoURL: this.photoURL,
      coverPage: this.coverPage,
      // photoStyle: this.photoStyle,
      firstLogin: false
    }, {merge: true})
    .then(() => {
      loading.dismiss();
      this.toast('Actualización exitosa!', 'success');
      this.route.navigate(['/dashboard/app/home']);
    })
    .catch (error => {
      console.log(error.message);
      this.toast(error.message, 'danger');
    });
  }

  async presentActionSheetPhotoProfile() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: 'Tomar foto',
        handler: () => {
          this.addPhoto('camera');
        }
      }, {
        text: 'Seleccionar foto',
        handler: () => {
          this.addPhoto('library');
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentActionSheetCoverPage() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: 'Tomar foto',
        handler: () => {
          this.addCoverPage('camera');
        }
      }, {
        text: 'Seleccionar foto',
        handler: () => {
          this.addCoverPage('library');
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async toast(message, status) {
    const toast = await this.toastCtrl.create({
      message,
      color: status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  } // fin del toast

  // métodos para deslizar sliders
  slideToBack() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slideCount --;
    this.slides.lockSwipes(true);
  }
  slideToForward() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slideCount ++;
    this.slides.lockSwipes(true);
  }

}
