import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, MenuController, NavController, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UIServicesService } from '../../services/ui-services.service';
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

  //variable temporal para guardar el usuario 
  user = {
    email: '',
    password: '',
    role: null
  };
  selected_option: string; 
  errormessage: string;

  constructor(private authSvc: AuthService,
              private uiService: UIServicesService,
              private navCtrl: NavController,
              public menu: MenuController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private route: Router) { }

  ngOnInit() {
    //inhabilitar el menú
    this.menu.enable(false);
  }
  
  //bloqueo de slide login/registro
  ionViewDidEnter(){
    this.slides.lockSwipes(true);
  }

  // async onLogin(fLogin: NgForm) {
  //   if(fLogin.invalid){return;}
  //   try{
  //     const user = await this.authSvc.login(this.user.email,this.user.password);
  //     if (user) {
  //       const isVerified = this.authSvc.isEmailVerified(user);
  //       this.redirectUser(isVerified);
  //     }
  //     else{
  //       this.uiService.presentAlert('Usuario y/o contraseña incorrectos.')
  //     }
  //   }catch(error){
  //     console.log('Login error -->',error);
  //   }
  // }

  onLoginGoogle(){
      const user =  this.authSvc.singInGoogle();
      console.log(user);
  }

  // async onRegister(fRegister: NgForm) {
  //   if(fRegister.invalid){return;}
  //   try {
  //     const user = await this.authSvc.register(this.user.email, this.user.password, this.user.role );
  //     if (user) {
  //       console.log('User->', user);    
  //       user.role = this.user.role;
  //       user.firstLogin = true;      
  //       this.authSvc.isEmailVerified(user);
  //       this.uiService.presentAlert('Hemos enviado un mensaje de verificación a sus correo electrónico.');
  //       this.uiService.presentToast('¡Se ha registrado con éxito!',2500);
  //       this.slideToLogin();
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }




  //nuevo Login

  login(){
    if(this.user.email && this.user.password){
      this.authSvc.signIn(this.user.email, this.user.password)
    } else{
      this.toast('Por favor ingrese su correo y contraseña', 'warning');
    }
  }


  //nuevo Register
  async register(){
    if(this.user.email && this.user.password && this.user.role){
      const loading = await this.loadingCtrl.create({
        message: 'Procesando...',
        spinner: 'crescent',
        showBackdrop: true
      });
      loading.present();

      this.afAuth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then((data) =>{
        data.user.sendEmailVerification();
        this.afs.collection('users').doc(data.user.uid).set({
          'uid': data.user.uid,
          'email': this.user.email,
          'role': this.user.role,
          'createdAt': Date.now()
        })
        .then(() => {
          loading.dismiss();
          this.toast('Registro exitoso! Por favor revise su correo electrónico!', 'success');
          this.slideToLogin();
        })
        .catch(error => {
          loading.dismiss();
          this.toast(error.message,'danger');  
          this.slideToRegister();        
        })
      })
      .catch(error => {
        loading.dismiss();
        this.toast(error.message,'danger'); 
        this.slideToRegister();              
      })
    } else {
      this.toast('Por favor complete todos los campos!', 'warning');
    }
  } // fin de register

  async toast(message, status){
    const toast = await this.toastCtrl.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  } // fin del toast

   //método para redireccionar a DASHBOARD si el usuario se encuentra verificado
   private redirectUser(isVerified:boolean):void{
    if(isVerified){
      this.navCtrl.navigateRoot('/welcome', { animated: true })
    }else{
      this.uiService.presentAlert('Antes debe validar su cuenta desde el enlace enviado a su correo electrónico.');
    }
  }

  selectedOption(){
    console.log(this.user.role);
  }

  //métodos para dslizar sliders LOGIN/REGISTER
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
