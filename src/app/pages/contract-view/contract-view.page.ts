import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Contrato } from '../../models/interfaces';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contract-view',
  templateUrl: './contract-view.page.html',
  styleUrls: ['./contract-view.page.scss'],
})
export class ContractViewPage implements OnInit {

  contrato: Contrato;

  constructor(private database: FirestoreService,
              private navCtrl: NavController) {
    this.contrato = this.database.varTemp;
   }

  ngOnInit() {
  }

  rejectContract(){
    let path = 'users/' + this.contrato.cliente.uid + '/notificaciones';
    const updateDoc = {
      estado: 'Rechazado'
    };
    this.database.updateDocument(updateDoc, path, this.contrato.id);
    path = 'users/' + this.contrato.fotografo.uid + '/notificaciones';
    this.database.updateDocument(updateDoc, path, this.contrato.id);
    // Pendiente confirmación
    this.back();
  }

  aceptContract(){
    let path = 'users/' + this.contrato.cliente.uid + '/notificaciones';
    const updateDoc = {
      estado: 'Aceptado'
    };
    this.database.updateDocument(updateDoc, path, this.contrato.id);
    path = 'users/' + this.contrato.fotografo.uid + '/notificaciones';
    this.database.updateDocument(updateDoc, path, this.contrato.id);
    this.addClient();
    this.addPhotographer();
    // Pendiente confirmación
    this.back();
  }

  addClient(){
    const path = 'users/' + this.contrato.fotografo.uid + '/clientes';
    this.database.createDocument(this.contrato.cliente, path, this.contrato.cliente.uid);
  }

  addPhotographer(){
    const path = 'users/' + this.contrato.cliente.uid + '/fotografos';
    this.database.createDocument(this.contrato.fotografo, path, this.contrato.fotografo.uid);
  }

  back(){
    this.navCtrl.navigateBack(['/dashboard/app/notifications']);
  }

}
