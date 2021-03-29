import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(public storage: AngularFireStorage,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) { }

  async uploadImage(file: any, path: string, name: string): Promise<string> {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    return new Promise( resolve => {
      const filePath = `${path}/${name}_${new Date().getTime()}`;
      const ref = this.storage.ref(filePath);
      const task = ref.putString(file, 'data_url');
      task.snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe( async res => {
            await loading.dismiss();
            const alert = await this.alertCtrl.create({
              header: 'Felicitaciones',
              message: '¡Se completó la carga de la foto a Firebase!',
              buttons: ['OK']
            });

            await alert.present();
            const downloadURL = res;
            resolve(downloadURL);
            return;
          });
        })
      ).subscribe();
    });
  }

  // async uploadFirebase() {

  //   const loading = await this.loadingCtrl.create();
  //   await loading.present();
  //   this.imagePath = new Date().getTime() + '.jpg';

  //   this.upload = this.afStorage.ref(this.imagePath).putString(this.image, 'data_url');
  //   this.upload.then(async () => {
  //     this.image = 'assets/no-image-banner.jpg';
  //     await loading.dismiss();
  //     const alert = await this.alertCtrl.create({
  //       header: 'Felicitaciones',
  //       message: '¡Se completó la carga de la foto a Firebase!',
  //       buttons: ['OK']
  //     });
  //     this.photoURL = this.imagePath;
  //     await alert.present();
  //   });
  // }
}
