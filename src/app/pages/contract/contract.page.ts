import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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
    { name: 'Deportes/Acción',
      des: '',
      value: 'sports' },
    { name: 'Comercial/Editorial',
      des: '',
      value: 'comercial' },
    { name: 'Naturaleza/Fauna salvaje',
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

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  onCancel() {
    this.navCtrl.navigateBack(['/dashboard/app/home/portfolio'], {animationDirection: 'back'});
  }

  onAccept() {
    window.alert('Estilo: ' + this.styleVal + ', Locación: ' + this.placeVal);
    this.navCtrl.navigateRoot(['/dashboard/app/home/portfolio']);
  }

}
