import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  email = '';

  constructor(private authSrv: AuthService,
              private alertCtrl: AlertController,
              private navCtrl: NavController) { }

  ngOnInit() {}

  async sendMail(){
    try {
      await this.authSrv.resetPassword(this.email);
      this.presentAlert();
    } catch (error){
      console.log(error);
    }
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperación de contraseña',
      message: 'Acabamos de enviarte un correo electrónico con el enlace de restablecimiento de tu contraseña. Por favor revisa tu correo electrónico y sigue las instrucciones.',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.navCtrl.back();
        }
      }]
    });

    await alert.present();
  }

}
