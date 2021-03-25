import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { UIServicesService } from '../../services/ui-services.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  email = '';

  constructor(private authSrv: AuthService, 
              private modalCtrl: ModalController,
              private uiService: UIServicesService,
              private alertCtrl: AlertController,
              private navCtrl: NavController) { }

  ngOnInit() {}

  async sendMail(){
    try {
      await this.authSrv.resetPassword(this.email);
      this.presentAlert();
    } catch(error){
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
