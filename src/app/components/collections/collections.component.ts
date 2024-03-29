import { Component, OnInit, Input } from '@angular/core';
import { Collection, Photo, User } from '../../models/interfaces';
import { FirestoreService } from '../../services/firestore.service';
import { ModalController, IonRouterOutlet, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { UIServicesService } from '../../services/ui-services.service';
import { CollectionComponent } from '../collection/collection.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {

  @Input() collections: Collection[] = [];

  user: User;
  textSearch = '';
  loading: any;
  private path = 'collections';
  collection: Collection;

  constructor(private database: FirestoreService,
              private modalCtrl: ModalController,
              private routerOutlet: IonRouterOutlet,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private uiServices: UIServicesService,
              private loadingCtrl: LoadingController,
              private authSvc: AuthService) { }

  ngOnInit() {
    this.authSvc.user$.subscribe(user => {
      this.user = user;
    });
  }

  openCollection(collection: Collection){
    this.database.collectionGeneral = collection;
    console.log(collection);
    this.modalCtrl.create({
      component: CollectionComponent
    }).then(m => m.present());
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: CollectionComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      showBackdrop: true
    });
    return await modal.present();
  }

  async deleteItems(item: Collection){
    const alert = await this.alertCtrl.create({
      header: 'ADVERTENCIA',
      message: '¿Seguro desea <strong>eliminar</strong> esta colección?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
            this.presentLoading('Espere por favor...');
            this.database.deleteDocument(this.path, item.id).then( res => {
              this.loading.dismiss();
              this.uiServices.presentToast('Eliminado con éxito.', 2000);
            }).catch( error => {
              this.uiServices.presentToast('Error al eliminar.', 2000);
              console.log('Error =>', error);
            });
          }
        }
      ]
    });

    await alert.present();
}

  async presentActionSheet(item: Collection) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: [{
        text: 'Editar',
        icon: 'pencil',
        handler: () => {
          console.log('Edit clicked');
          console.log(item);

          this.presentModalEdit(item);
        }
      }, {
        text: 'Publicar',
        icon: 'globe',
        handler: () => {
          console.log('Publish clicked');
        }
      }, {
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
          this.deleteItems(item);
        }
      },  {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  search( event ){
    const text = event.target.value;
    this.textSearch = text;
  }

  async presentLoading(message: string) {
    this.loading = await this.loadingCtrl.create({
      message,
    });
    await this.loading.present();
  }

  async presentModalEdit(item: Collection) {
    this.database.collectionGeneral = item;
    const modal = await this.modalCtrl.create({
      component: CollectionComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      showBackdrop: true
    });
    return await modal.present();
  }

}
