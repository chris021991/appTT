import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UIServicesService {

  constructor(private alertCrtl: AlertController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController) { }

  async presentAlert( message: string ) {
    const alert = await this.alertCrtl.create({
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
    });
    await loading.present();
  }
 
}
