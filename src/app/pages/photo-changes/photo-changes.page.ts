import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/interfaces';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { CameraService } from '../../services/camera.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

declare var window: any;

@Component({
  selector: 'app-photo-changes',
  templateUrl: './photo-changes.page.html',
  styleUrls: ['./photo-changes.page.scss'],
})
export class PhotoChangesPage implements OnInit {

  user: User = {};
  tempImage = '';
  imagePath = 'photoProfile';

  constructor(private authSrv: AuthService,
              private storage: AngularFireStorage,
              private afs: AngularFirestore,
              private cameraSvc: CameraService,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.authSrv.user$.subscribe(user => {
      this.user = user;
      this.tempImage = user.photoURL;
    });
  }

  onCamera() {
    this.cameraSvc.openCamera()
    .then((imageData) => {
     const img = window.Ionic.WebView.convertFileSrc('data:image/jpg;base64,' + imageData);
     this.tempImage = img;
    }, (err) => {
     // Handle error
    });
  }

  onLibrary() {
    this.cameraSvc.openLibraryOnePic()
    .then((imageData) => {
        const img = window.Ionic.WebView.convertFileSrc('data:image/jpg;base64,' + imageData);
        this.tempImage = img;
    }, (err) => {
      // Handle error
    });
  }

  async changeImage() {
    if (this.tempImage !== this.user.photoURL) {
      const loading = await this.loadingCtrl.create({
        spinner: 'crescent',
        showBackdrop: true
      });

      loading.present();

      const img = await this.uploadImage();
      console.log(img);

      this.afs.collection('users').doc(this.user.uid).set({
        photoURL: img
      }, {merge: true})
      .then(() => {
        loading.dismiss();
      })
      .catch (error => {
        console.log('Error ->', error.message);
        loading.dismiss();
      });
    }
  }

  private async uploadImage() {

    return new Promise( resolve => {
      const filePath = `${this.imagePath}/${this.user.uid}`;
      const ref = this.storage.ref(filePath);
      const task = ref.putString(this.tempImage, 'data_url');
      task.snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe( async res => {
            const downloadURL = res;
            console.log('Res', res);
            resolve(downloadURL);
            return;
          });
        })
      ).subscribe();
    });
  }

  share() {}

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: 'Tomar foto',
        handler: () => {
          this.onCamera();
        }
      }, {
        text: 'Seleccionar foto',
        handler: () => {
          this.onLibrary();
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
