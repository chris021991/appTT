import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Contrato, Paquete, PrecioPaquete, Roles } from '../../models/interfaces';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contract-view',
  templateUrl: './contract-view.page.html',
  styleUrls: ['./contract-view.page.scss'],
})
export class ContractViewPage implements OnInit {

  contrato: Contrato;
  ranking: string;
  precio: PrecioPaquete;
  role: Roles;

  constructor(private database: FirestoreService,
              private navCtrl: NavController,
              private authSvc: AuthService) {
    this.contrato = this.database.varTemp;
   }

  ngOnInit() {
    this.authSvc.user$.subscribe(user => {
      this.role = user.role;
    });
    this.getPrecio(this.contrato.paquete, this.contrato.fotografo.uid);
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

  getPrecio(paquete: Paquete, fotografo: string) {
    const path = 'ranking';
    this.database.getDocument<any>(path, fotografo).subscribe(res => {
      this.ranking = res.nivel;
      if (res){
        paquete.prices.every(precio => {
          if (precio.name === res.nivel) {
            this.precio = precio;
            return false;
          }
          return true;
        });
      } else {
        this.precio = paquete.prices[0];
      }
      paquete.prices = [this.precio];
    });
  }

  back(){
    this.navCtrl.navigateBack(['/dashboard/app/notifications']);
  }

}
