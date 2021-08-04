import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Contrato } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { NavController, AlertController, LoadingController, ModalController, IonItemSliding } from '@ionic/angular';
import { RankingComponent } from '../../components/ranking/ranking.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notificaciones: Contrato[] = [];
  uid = '';

  constructor(private database: FirestoreService,
              private authSvc: AuthService,
              private navigateCtrl: NavController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.authSvc.user$.subscribe(user => {
      this.getNotifications(user.uid);
      this.uid = user.uid;
    });
  }

  // Consulta todas las notificaciones del cliente logueado
  getNotifications(uid: string){
    const path = 'users/' + uid + '/notificaciones';
    this.database.getCollectionChanges<Contrato>(path).subscribe(res => {
      this.notificaciones = res;
    });
  }

  // Visualiza la notificación
  viewNotification(notificacion: Contrato){
    this.database.varTemp = notificacion;
    this.navigateCtrl.navigateForward(['/contract-view']);
  }

  // Finaliza el contrato al haber culminado el proceso
  async finalizeContract(contrato: Contrato){
    let path = 'users/' + contrato.cliente.uid + '/notificaciones';
    const updateDoc = {
      estado: 'Finalizado'
    };

    const text = '¿Está seguro que dese finalizar el contrato?';
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: text,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {
            this.alertCtrl.dismiss();
          }
        }, {
          text: 'Aceptar',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Enviando notificación...'
            });
            await loading.present();

            this.database.updateDocument(updateDoc, path, contrato.id).then(() => {
              path = 'users/' + contrato.fotografo.uid + '/notificaciones';
              this.database.updateDocument(updateDoc, path, contrato.id).then(async () => {
                this.loadingCtrl.dismiss();
                const modal = await this.modalCtrl.create({
                  component: RankingComponent,
                  componentProps: {
                    contrato
                  }
                });
                await modal.present();
              });
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async valorar(notificacion: Contrato, sliding: IonItemSliding) {
    const modal = await this.modalCtrl.create({
      component: RankingComponent,
      componentProps: {
        contrato: notificacion
      }
    });
    sliding.close();
    await modal.present();
  }

}
