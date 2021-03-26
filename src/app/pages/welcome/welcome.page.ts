import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, LoadingController, ToastController } from '@ionic/angular';
import { User, Roles, Social } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  @ViewChild('slideWelcome') slides: IonSlides;

  uid: string;
  displayName: string;
  phone: number;
  biography: string;
  address: string;

  slideCount = 0;

  constructor( private authSrv : AuthService,
               private navCtrl: NavController,
               private loadingCtrl: LoadingController,
               private toastCtrl: ToastController,
               private route: Router,
               private afs: AngularFirestore ) { }


  async ngOnInit() {
    this.authSrv.user$.subscribe(user => {
      this.uid = user.uid,
      this.displayName = user.displayName,
      this.phone = user.phone,
      this.biography = user.biography,
      this.address = user.address
    });
  }

  ionViewDidEnter(){
    this.slides.lockSwipes(true);
  }

  onSubmit(){
   
  }

  async finish(){
    await this.updateUserData()
    .then(() => {
      this.navCtrl.navigateRoot('/home/app/portfolio', { animated: true });
    })
    .catch (error => {
      console.log(error);
      
      this.toast(error.message, 'danger');
    })
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

  async updateUserData(){
    const loading = await this.loadingCtrl.create({
      message: 'Actualizando...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afs.collection('users').doc(this.uid).set({
      'displayName': this.displayName,
      'phone': this.phone,
      'address': this.address,
      'biography': this.biography,
    },{merge: true})
    .then(() => {
      loading.dismiss();
      this.toast('Actualización exitosa!', 'success');
      this.route.navigate(['/home/app/portfolio'])
    })
    .catch (error => {
      console.log(error);
      
      this.toast(error.message,'danger');
    })
  }

  async toast(message, status){
    const toast = await this.toastCtrl.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  } // fin del toast

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
