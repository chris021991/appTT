import { Component, Input, OnInit } from '@angular/core';
import { User, Contrato } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {

  @Input() contrato: Contrato;

  user: User;
  valoracion: number;
  ratings = [{
    value: 1,
    icon: 'star-outline'
  }, {
    value: 2,
    icon: 'star-outline'
  }, {
    value: 3,
    icon: 'star-outline'
  }, {
    value: 4,
    icon: 'star-outline'
  }, {
    value: 5,
    icon: 'star-outline'
  }];

  constructor(private authSvc: AuthService,
              private database: FirestoreService,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController) { }

  ngOnInit() {
    this.authSvc.user$.subscribe(user => {
      this.user = user;
    });
    console.log(this.contrato);
  }

    // Loop para mostrar número de estrellas
    setRanking(val: number) {
      const rtgs = this.ratings;
      this.valoracion = val;
      console.log(this.valoracion);
      for (let i = 0; i < rtgs.length; i++) {
        if (i < val) {
          rtgs[i].icon = 'star';
        } else {
          rtgs[i].icon = 'star-outline';
        }
      }
    }

    clientRanking() {
      const path = 'users/' + this.contrato.cliente.uid + '/valoraciones';
      const data = {
        value: this.valoracion
      };
      this.database.createDocument(data, path, this.contrato.fotografo.uid).then(() => {
        this.close();
        this.presentToast();
      });
    }

    photographerRanking() {
      const path = 'users/' + this.contrato.fotografo.uid + '/valoraciones';
      const data = {
        value: this.valoracion
      };
      this.database.createDocument(data, path, this.contrato.cliente.uid).then(() => {
        this.close();
        this.presentToast();
      });
    }

    async presentToast() {
      const toast = await this.toastCtrl.create({
        message: 'Calificación enviada con éxito',
        color: 'success',
        position: 'top',
        duration: 2000
      });
      toast.present();
    }

    close() {
      this.modalCtrl.dismiss();
    }

}
