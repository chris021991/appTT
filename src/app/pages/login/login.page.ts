import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, MenuController, NavController, ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Roles } from '../../models/interfaces';
import { UIServicesService } from '../../services/ui-services.service';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal') slides: IonSlides;

  //variable temporal para guardar el usuario 
  loginUser = {
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
              private modalCtrl: ModalController) { }

  ngOnInit() {
    //inhabilitar el menú
    this.menu.enable(false);
  }
  
  //bloqueo de slide login/registro
  ionViewDidEnter(){
    this.slides.lockSwipes(true);
  }

  async onLogin(fLogin: NgForm) {
    if(fLogin.invalid){return;}
    try{
      const user = await this.authSvc.login(this.loginUser.email,this.loginUser.password);
      if (user) {
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
      else{
        this.uiService.presentAlert('Usuario y/o contraseña incorrectos.')
      }
    }catch(error){
      console.log('Login error -->',error);
    }
  }

  async onLoginGoogle(){
    try{
      const user = await this.authSvc.loginGoogle();
      if (user) {
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
      else{
        this.uiService.presentAlert('Usuario y/o contraseña no son correctos');
      }
    }catch(error){
      console.log('Error->',error)
    }
  }

  async onRegister(fRegister: NgForm) {
    if(fRegister.invalid){return;}
    try {
      const user = await this.authSvc.register(this.loginUser.email, this.loginUser.password, this.loginUser.role );
      if (user) {
        console.log('User->', user);    
        user.role = this.loginUser.role;
        user.firstLogin = true;      
        this.authSvc.isEmailVerified(user);
        this.uiService.presentAlert('Hemos enviado un mensaje de verificación a sus correo electrónico!');
        this.uiService.presentToast('¡Se ha registrado con éxito!',2500);
        this.slideToLogin();
      }
    } catch (error) {
      console.error(error)
    }
  }

  onReset(){
    this.modalCtrl.create({
      component: ForgotPasswordComponent
    }).then(m => m.present());
  }

   //método para redireccionar a DASHBOARD si el usuario se encuentra verificado
   private redirectUser(isVerified:boolean):void{
    if(isVerified){
      this.navCtrl.navigateRoot('/welcome', { animated: true })
    }else{
      this.uiService.presentAlert('Antes debe validar su cuenta desde su correo electrónico registrado!');
    }
  }

  selectedOption(){
    console.log(this.loginUser.role);
  }

  //métodos para dslizar sliders LOGIN/REGISTER
  slideToLogin(){
    this.slides.lockSwipes(false);
    this.loginUser.email = '';
    this.loginUser.password = '';
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }
  slideToRegister(){
    this.slides.lockSwipes(false);
    this.loginUser.email = '';
    this.loginUser.password = '';
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }

}
