import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../../models/interfaces';

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
               private afs: AngularFirestore ) { }

  @ViewChild('slideWelcome') slides: IonSlides;

  uid: string;
  displayName: string;
  phone: number;
  biography: string;
  address: string;

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
    });
  }

  ionViewDidEnter() {
    this.slides.lockSwipes(true);
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

  // métodos para dslizar sliders LOGIN/REGISTER
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
