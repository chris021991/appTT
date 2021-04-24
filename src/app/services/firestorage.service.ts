import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable()

export class FirestorageService {

  MEDIA_STORAGE_PATH = 'images';

  constructor(private storage: AngularFireStorage,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) { }


    async uploadImages(images: any[], path: string, name: string) {
      // const loading = await this.loadingCtrl.create();
      // await loading.present();
      const resp = [];

      for (const image of images) {

        // image.uploading = true;
        const filePath = `${path}/${name}_${new Date().getTime()}`;
        const ref = this.storage.ref(filePath);
        // subir archivos
        // const task = this.storage.upload(filePath, image.file);

        // subir imágenes por URL
        const task = ref.putString(image, 'data_url');

        // item.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(async res => {
              console.log('Res ->', res);
              resp.push(res);
              console.log('Resp ->', resp);

              // image.downloadURL = res;
              // image.uploading = false;

            });
          })
          ).subscribe();
        }
      console.log('Resp final ->', resp);
      return resp;
    }

  async uploadImage(file: any, path: string, name: string): Promise<string> {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    return new Promise( resolve => {
      const filePath = `${path}/${new Date().getTime()}_${name}`;
      const ref = this.storage.ref(filePath);
      const task = ref.putString(file, 'data_url');
      task.snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe( async res => {
            await loading.dismiss();
            // const alert = await this.alertCtrl.create({
            //   header: 'Felicitaciones',
            //   message: '¡Se completó la carga de la foto a Firebase!',
            //   buttons: ['OK']
            // });

            // await alert.present();
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
