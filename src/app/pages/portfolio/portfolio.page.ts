import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/interfaces';
import { FirestoreService } from '../../services/firestore.service';
import { UIServicesService } from '../../services/ui-services.service';
import { PhotoPortfolioComponent } from '../../components/photo-portfolio/photo-portfolio.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {

  @ViewChild('slidePortfolio') slides: IonSlides;

  userLogged: User;
  user: User;
  photosPortfolio: string[] = [
    'https://firebasestorage.googleapis.com/v0/b/appttdb.appspot.com/o/collections%2FKathe%20Recalde?alt=media&token=ba246e15-52a1-44e9-89d2-a76ece6ca352',
    'https://firebasestorage.googleapis.com/v0/b/appttdb.appspot.com/o/collections%2FNathy%20Mi%C3%B1o?alt=media&token=51060cd7-65a1-411c-b77f-daf3ffaf98f2',
    'https://firebasestorage.googleapis.com/v0/b/appttdb.appspot.com/o/collections%2FPatricia%20Macias_1614626058153?alt=media&token=6209e905-202e-4356-ac8c-8b343bde657d',
    'https://firebasestorage.googleapis.com/v0/b/appttdb.appspot.com/o/collections%2FPatricia%20Macias_1614625982701?alt=media&token=993bfc75-8aa1-4422-af4b-09188d72b6c4',
    'https://firebasestorage.googleapis.com/v0/b/appttdb.appspot.com/o/collections%2FPeter%20Coulson_1614920010044?alt=media&token=c12b01e9-b834-4dbe-946c-c8366d43a5e4',
    'https://firebasestorage.googleapis.com/v0/b/appttdb.appspot.com/o/collections%2FPatricia%20Macias_1614626098655?alt=media&token=aa2d9e67-6451-43ed-acf7-4200d1c05ad0'
  ];

  constructor(private firestoreSvc: FirestoreService,
              private authSvc: AuthService,
              private uiService: UIServicesService,
              private navCtrl: NavController,
              private route: Router) { }

  ngOnInit() {
    // usuario temporal enviado desde el componente account (pendiente actualizar user al cargar fotos)
    this.user = this.firestoreSvc.userTemp;
    // validación para que exista un User seleccionado
    if (this.user === null || this.user === undefined) {
      this.navCtrl.navigateRoot(['/dashboard/app/home']);
    }
    // devuelve el usuario logeado actualmente
    this.authSvc.user$.subscribe( userLogged => {
      this.userLogged = userLogged;
    });
  }

   // bloqueo de slide
   ionViewDidEnter(){
    this.slides.lockSwipes(true);
  }

  openPhoto( photo ) {
    this.firestoreSvc.photoTemp = photo;
    this.route.navigate(['/dashboard/app/home/photo']);
  }

  editPhotosPortfolio() {
    this.uiService.presentModal(PhotoPortfolioComponent);
  }

  onContract() {
    this.navCtrl.navigateRoot(['/contract'], {animated: true});
  }

  back() {
    this.navCtrl.navigateBack([]);
  }

  // valida el value del segment
  segmentChanged(ev: any) {
    if (ev.detail.value === 'portfolio'){
      this.slideToPortfolio();
    } else if (ev.detail.value === 'bio'){
      this.slideToBio();
    }
  }
  // métodos para deslizar sliders
  slideToPortfolio(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }
  slideToBio(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }

}
