import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, MenuController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal') slides: IonSlides;

  // variable temporal para guardar el usuario
  user = {
    email: '',
    password: '',
    role: null,
    photoURL: ''
  };
  firstLogin: boolean;
  errormessage: string;

  constructor(private authSvc: AuthService,
              public menu: MenuController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private navCtrl: NavController) { }

  ngOnInit() {
    // inhabilitar el menú
    this.menu.enable(false);
    this.authSvc.user$.subscribe(user => {
      this.firstLogin = user?.firstLogin;
    });
  }

  // bloqueo de slide login/registro
  ionViewDidEnter(){
    this.slides.lockSwipes(true);
  }

  async onLogin(){
    if (this.user.email && this.user.password){
      await this.authSvc.signIn(this.user.email, this.user.password);
      if (this.firstLogin) {
        this.navCtrl.navigateRoot(['/welcome']);
      } else if (!this.firstLogin) {
        this.navCtrl.navigateRoot(['/dashboard/app/home']);
      }
    } else{
      this.toast('Por favor ingrese su correo y contraseña', 'warning');
    }
  }

  async onLoginGoogle(){
    await this.authSvc.singInGoogle();
    if (this.firstLogin) {
      this.navCtrl.navigateRoot(['/welcome']);
    } else if (!this.firstLogin) {
      this.navCtrl.navigateRoot(['/dashboard/app/home']);
    }
  }

  async onRegister(){
    if (this.user.email && this.user.password && this.user.role){
      const loading = await this.loadingCtrl.create({
        message: 'Procesando...',
        spinner: 'crescent',
        showBackdrop: true
      });
      loading.present();

      this.afAuth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then((data) => {
        data.user.sendEmailVerification();
        this.afs.collection('users').doc(data.user.uid).set({
          uid: data.user.uid,
          email: this.user.email,
          role: this.user.role,
          createdAt: Date.now(),
          firstLogin: true,
          photoURL: this.user.photoURL
        })
        .then(() => {
          loading.dismiss();
          this.toast('Registro exitoso! Por favor revise su correo electrónico!', 'success');
          this.slideToLogin();
        })
        .catch(error => {
          loading.dismiss();
          this.toast(error.message, 'danger');
          this.slideToRegister();
        });
      })
      .catch(error => {
        loading.dismiss();
        this.toast(error.message, 'danger');
        this.slideToRegister();
      });
    } else {
      this.toast('Por favor complete todos los campos!', 'warning');
    }
  } // fin de register

  async toast(message, status){
    const toast = await this.toastCtrl.create({
      message,
      color: status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  } // fin del toast

  // métodos para dslizar sliders LOGIN/REGISTER
  slideToLogin(){
    this.slides.lockSwipes(false);
    this.user.email = '';
    this.user.password = '';
    this.user.role = null;
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }
  slideToRegister(){
    this.slides.lockSwipes(false);
    this.user.email = '';
    this.user.password = '';
    this.user.role = null;
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }

}
