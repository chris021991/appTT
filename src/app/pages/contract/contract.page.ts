import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Contrato, EstiloFotografico, Paquete, PrecioPaquete } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.page.html',
  styleUrls: ['./contract.page.scss'],
})
export class ContractPage implements OnInit {

  public styles = [
    { name: 'Bodas y compromisos',
      des: '',
      value: 'weeding' },
    { name: 'Retrato',
      des: '',
      value: 'portrait' },
    { name: 'Eventos',
      des: '',
      value: 'event' },
    { name: 'Moda',
      des: '',
      value: 'fashion' },
    { name: 'Graduación',
      des: '',
      value: 'graduation' },
    { name: 'Deportes / Acción',
      des: '',
      value: 'sports' },
    { name: 'Comercial / Editorial',
      des: '',
      value: 'comercial' },
    { name: 'Naturaleza / Fauna salvaje',
      des: '',
      value: 'nature' },
    { name: 'Bellas artes',
      des: '',
      value: 'art' },
    { name: 'Fotoperiodismo',
      des: '',
      value: 'journalism' }
  ];

  public places = [
    { name: 'Fotos en estudio',
      des: 'Seleccionalo si el trabajo debe realizarse en un estudio fotográfico.' ,
      value: 'studio' },
    { name: 'Fotos en localización',
      des: 'Si el trabajo debe realizarse en una ubicación que no es un estudio fotográfico',
      value: 'location' },
    { name: 'Fotos en localización y en estudio',
      des: 'Si el trabajo incluye tanto fotos en estudio como en localización',
      value: 'boot' }
  ];

  styleVal = '';
  placeVal = '';
  nuevoContrato: Contrato = {
    fecha: null,
    fotografo: null,
    cliente: null,
    estilo: null,
    locacion: null,
    paquete: null,
    estado: 'Pendiente',
    id: null
  };
  estilos: EstiloFotografico[] = [];
  paquetes: Paquete[] = [];
  precio: PrecioPaquete;
  select: 'estilo' | 'paquete' | 'locacion' = 'estilo';

  constructor(private navCtrl: NavController,
              private authSvc: AuthService,
              private database: FirestoreService) { }

  ngOnInit() {
    this.authSvc.user$.subscribe(user => {
      this.nuevoContrato.cliente = user;
      console.log(this.nuevoContrato);
    });
    this.nuevoContrato.fotografo = this.database.userTemp;
    this.nuevoContrato.fecha = new Date();
    this.nuevoContrato.id = this.database.createId();
    this.getEstilos();
    console.log(this.nuevoContrato);
  }

  onCancel() {
    this.navCtrl.navigateBack(['/dashboard/app/home/portfolio'], {animationDirection: 'back'});
  }

  onAccept() {
    // window.alert('Estilo: ' + this.styleVal + ', Locación: ' + this.placeVal);
    // this.navCtrl.navigateRoot(['/dashboard/app/home/portfolio']);
    console.log(this.styleVal);
    console.log(this.placeVal);
    this.nuevoContrato.locacion = this.placeVal;
    console.log(this.nuevoContrato);
    let path = 'users/' + this.nuevoContrato.cliente.uid + '/notificaciones';
    this.database.createDocument(this.nuevoContrato, path, this.nuevoContrato.id).then(() => {
      console.log('Contrato enviado con exito');
    });
    path = 'users/' + this.nuevoContrato.fotografo.uid + '/notificaciones';
    this.database.createDocument(this.nuevoContrato, path, this.nuevoContrato.id).then(() => {
      console.log('Contrato enviado con exito');
    });
  }

  getEstilos() {
    const path = 'photo_genres';
    const observable = this.database.getCollectionChanges<EstiloFotografico>(path).subscribe(res => {
      this.estilos = res;
      observable.unsubscribe();
      console.log(this.estilos);
    });
  }

  openPackages(estilo: EstiloFotografico){
    const path = 'photo_genres/' + estilo.id + '/packages';
    this.nuevoContrato.estilo = estilo.name;
    const observable = this.database.getCollectionChanges<Paquete>(path).subscribe(res => {
      this.paquetes = res;
      this.paquetes.forEach(paquete => {
        this.getPrecio(paquete, this.nuevoContrato.fotografo.uid);
      });
      this.select = 'paquete';
      observable.unsubscribe();
      console.log(this.paquetes);
    });
  }

  getPrecio(paquete: Paquete, fotografo: string) {
    const path = 'ranking';
    this.database.getDocument<any>(path, fotografo).subscribe(res => {
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

  seleccionarPaquete(paquete: Paquete){
    this.nuevoContrato.paquete = paquete;
    this.select = 'locacion';
  }

}
