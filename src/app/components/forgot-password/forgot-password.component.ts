import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UIServicesService } from '../../services/ui-services.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  email = '';

  constructor(private authSrv: AuthService, 
              private modalCtrl: ModalController,
              private uiService: UIServicesService,
              private alertCtrl: AlertController) { }

  ngOnInit() {}

  closeModal(){
    this.modalCtrl.dismiss();
  }

  async sendMail(){
    try {
      await this.authSrv.resetPassword(this.email);
      this.presentAlert();
      this.uiService.presentToast('Correo enviado',1500);
      this.closeModal();
    } catch(error)
      {console.log(error);
    }
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperación de contraseña',
      message: 'Acabamos de enviarte un correo electrónico con el enlace de reseteo de tu contraseña. Por favor revisa tu correo electrónico y sigue las instrucciones.',
      buttons: ['OK']
    });
    
    await alert.present();
  }

}
