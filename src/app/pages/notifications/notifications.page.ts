import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Contrato } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';

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
              private navigateCtrl: NavController) { }

  ngOnInit() {
    this.authSvc.user$.subscribe(user => {
      this.getNotifications(user.uid);
      this.uid = user.uid;
    });
  }

  getNotifications(uid: string){
    const path = 'users/' + uid + '/notificaciones';
    this.database.getCollectionChanges<Contrato>(path).subscribe(res => {
      this.notificaciones = res;
    });
  }

  viewNotification(notificacion: Contrato){
    this.database.varTemp = notificacion;
    this.navigateCtrl.navigateForward(['/contract-view']);
  }

}
