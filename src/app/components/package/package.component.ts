import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { ModalController, LoadingController, AlertController, ActionSheetController, IonRouterOutlet } from '@ionic/angular';
import { NewPackageComponent } from './new-package/new-package.component';

@Component({
  selector: 'app-package-component',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss'],
})
export class PackageComponent implements OnInit {

  @Input() genre: any;
  @Input() package: any;

  title = '';

  constructor(private database: FirestoreService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private actionSheetCtrl: ActionSheetController,
              private modalCtrl: ModalController) { }

  ngOnInit() {}

  private async deletePackage() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.alertCtrl.dismiss();
          }
        }, {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingCtrl.create();
            await loading.present();

            // Elimina documento
            this.database.deleteDocument(`photo_genres/${this.genre.id}/packages`, this.package.id).then(async () => {
              await loading.dismiss();
              // tslint:disable-next-line: no-shadowed-variable
              const alert = await this.alertCtrl.create({
                header: 'Completado',
                message: '¡Se ha eliminado correctamente!',
                buttons: ['OK']
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.package.name,
      buttons: [{
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          this.deletePackage();
        }
      }, {
        text: 'Editar',
        handler: () => {
          this.title = 'Editar';
          this.presentModal();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    // const { role } = await actionSheet.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
  }

  private async presentModal() {
    const modal = await this.modalCtrl.create({
      component: NewPackageComponent,
      componentProps: {
        genre: this.genre,
        package: this.package,
        title: this.title
      }
    });
    return await modal.present();
  }

}
