import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { User } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  @ViewChild('slideWelcome') slides: IonSlides;

  user: User = {
    name: '',
    lastName: '',
    phone: '',
    address: '',
    photoURL: '',
    website: '',
    biography: '',
    experience: '',
    location: '',
    studies: '',
    photoStyle: '',
  };
  slideCount = 0;

  constructor( private authSrv : AuthService,
               private navCtrl: NavController ) { }


  async ngOnInit() {
    this.user = await this.authSrv.getCurrentUser();
    this.authSrv.userLogged = this.user;
  }

  ionViewDidEnter(){
    this.slides.lockSwipes(true);
  }

  onSubmit(){
   
  }

  finish(){
    this.navCtrl.navigateRoot('/home/app/portfolio', { animated: true })
  }

  public form = [
    { val: 'Moda', isChecked: false },
    { val: 'Publicidad', isChecked: false },
    { val: 'Books', isChecked: false },
    { val: 'Video', isChecked: false },
    { val: 'Cine', isChecked: false },
    { val: 'Lookbooks', isChecked: false },
    { val: 'Dirección de fotografía', isChecked: false },
    { val: 'Retoque fotográfico', isChecked: false },
    { val: 'Retrato', isChecked: false },
    { val: 'Producto', isChecked: false },
    { val: 'Arquitectura', isChecked: false },
    { val: 'Naturaleza', isChecked: false },
    { val: 'Industrial', isChecked: false },
    { val: 'Animales', isChecked: false },
    { val: 'Vehículos', isChecked: false },
    { val: 'Bodas', isChecked: false },
    { val: 'Periodismo', isChecked: false },
    { val: 'Viajes', isChecked: false }
  ];

  //métodos para dslizar sliders LOGIN/REGISTER
  slideToBack(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slideCount --;
    this.slides.lockSwipes(true);   
  }
  slideToForward(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slideCount ++;
    this.slides.lockSwipes(true);  
  }

}
