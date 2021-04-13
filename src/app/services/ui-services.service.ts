import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UIServicesService {

  constructor(private alertCrtl: AlertController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController) { }

  async presentAlert( message: string ) {
    const alert = await this.alertCrtl.create({
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message,
      duration
    });
    toast.present();
  }

  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
    });
    await loading.present();
  }

  async presentModal(component: any) {
    const modal = await this.modalCtrl.create({
      component
    });
    return await modal.present();
  }

}
