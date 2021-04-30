import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { IonList, ModalController, IonRouterOutlet, LoadingController, AlertController } from '@ionic/angular';
import { NewPackageComponent } from '../../../components/package/new-package/new-package.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { OpenPackageComponent } from '../../../components/package/open-package/open-package.component';
import { EditPackageComponent } from '../../../components/package/edit-package/edit-package.component';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {

  @ViewChild(IonList) ionList: IonList;

  packages: any;
  id = '';
  path = 'photo_genres';

  constructor(private database: FirestoreService,
              private afs: AngularFirestore,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private routerOutlet: IonRouterOutlet) { }

  ngOnInit() {
    this.database.getCollectionChanges(this.path).subscribe((res) => {
      this.packages = res;
      console.log(res);
    });
  }

  async deletePackage(pack: any) {
    this.ionList.closeSlidingItems();
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

            // Elimina todas las colecciones dentro de packages
            this.afs.collection(this.path).doc(pack.id).collection('packages').ref.get()
            .then((query) => {
              query.forEach((doc) => {
                doc.ref.delete().then(() => {
                  console.log('Documento eliminado con éxito');
                // tslint:disable-next-line: only-arrow-functions
                }).catch(function(error) {
                  console.log('Error eliminando documento: ', error);
                });
              });
            })
            .then(async () => {
              // Elimina documento
              this.database.deleteDocument(this.path, pack.id);
              await loading.dismiss();
              // tslint:disable-next-line: no-shadowed-variable
              const alert = await this.alertCtrl.create({
                header: 'Completado',
                message: '¡Se ha eliminado correctamente!',
                buttons: ['OK']
              });
              await alert.present();
              console.log('Documento eliminado');
            })
            // tslint:disable-next-line: only-arrow-functions
            .catch(function(error) {
              console.log('Error Obteniendo Documentos: ', error);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  editPackage(pack: any) {
    console.log('Editar ->', pack.id);
    this.ionList.closeSlidingItems();
    this.presentModal(EditPackageComponent);
  }

  openPackage(pack: any) {
    this.presentModal(OpenPackageComponent);
  }

  addPackage() {
    this.presentModal(NewPackageComponent);
  }

  async presentModal(component) {
    const modal = await this.modalCtrl.create({
      component,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      showBackdrop: true
    });
    return await modal.present();
  }

}
