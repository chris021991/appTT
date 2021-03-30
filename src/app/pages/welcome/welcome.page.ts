import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FirestorageService } from 'src/app/services/firestorage.service';

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
               private firestorage: FirestorageService ) { }

  @ViewChild('slideWelcome') slides: IonSlides;

  uid: string;
  displayName: string;
  phone: number;
  biography: string;
  address: string;
  photoURL: string;
  coverPage: string;
  firstLogin: boolean;

  imageCoverPage = 'assets/no-image-banner.jpg';
  image = 'assets/no-image-banner.jpg';
  imagePath = 'photoProfile';
  coverPagePath = 'coverPage';

  slideCount = 0;

  public form = [
    { val: 'Bodas y compromisos', isChecked: false },
    { val: 'Retrato', isChecked: false },
    { val: 'Eventos', isChecked: false },
    { val: 'Moda', isChecked: false },
    { val: 'Colegio', isChecked: false },
    { val: 'Deportes/Acción', isChecked: false },
    { val: 'Comercial/Editorial', isChecked: false },
    { val: 'Naturaleza/Fauna salvaje', isChecked: false },
    { val: 'Bellas artes', isChecked: false },
    { val: 'Fotoperiodismo', isChecked: false }
  ];

  async ngOnInit() {
    this.authSrv.user$.subscribe(user => {
      this.uid = user.uid,
      this.displayName = user.displayName,
      this.phone = user.phone,
      this.biography = user.biography,
      this.address = user.address;
      this.photoURL = user.photoURL;
      this.coverPage = user.coverPage;
      this.firstLogin = user.firstLogin;
    });
  }

  ionViewDidEnter() {
    this.slides.lockSwipes(true);
  }

  async addPhoto(source: string) {
    if (source === 'camera') {
      console.log('camera');
      const cameraPhoto = await this.openCamera();
      this.image = 'data:image/jpg;base64,' + cameraPhoto;
    } else {
      console.log('library');
      const libraryImage = await this.openLibrary();
      this.image = 'data:image/jpg;base64,' + libraryImage;
    }
  }

  async addCoverPage(source: string) {
    if (source === 'camera') {
      console.log('camera');
      const cameraPhoto = await this.openCamera();
      this.imageCoverPage = 'data:image/jpg;base64,' + cameraPhoto;
    } else {
      console.log('library');
      const libraryImage = await this.openLibrary();
      this.imageCoverPage = 'data:image/jpg;base64,' + libraryImage;
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
    const photo = await this.firestorage.uploadImage(this.image, this.imagePath, this.uid);
    this.photoURL = photo;
  }

  async uploadPhotoCoverPage(){
    const coverPage = await this.firestorage.uploadImage(this.imageCoverPage, this.coverPagePath, this.uid);
    this.coverPage = coverPage;
  }

  async finish() {
    await this.updateUserData()
    .then(() => {
      this.navCtrl.navigateRoot('/home/app/portfolio', { animated: true });
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
      address: this.address,
      biography: this.biography,
      photoURL: this.photoURL,
      coverPage: this.coverPage,
      firstLogin: false
    }, {merge: true})
    .then(() => {
      loading.dismiss();
      this.toast('Actualización exitosa!', 'success');
      this.route.navigate(['/home/app/portfolio']);
    })
    .catch (error => {
      console.log(error.message);
      this.toast(error.message, 'danger');
    });
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
