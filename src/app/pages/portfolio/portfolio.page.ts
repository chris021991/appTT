import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { User, Photo } from '../../models/interfaces';
import { FirestoreService } from '../../services/firestore.service';
import { UIServicesService } from '../../services/ui-services.service';
import { PhotoPortfolioComponent } from '../../components/photo-portfolio/photo-portfolio.component';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {

  @ViewChild('slidePortfolio') slides: IonSlides;

  userLogged: User;
  user: User;
  photos: Photo[];

  constructor(private database: FirestoreService,
              private authSvc: AuthService,
              private uiService: UIServicesService,
              private navCtrl: NavController,
              private route: Router) { }

  ngOnInit() {
    // usuario temporal enviado desde el componente account (pendiente actualizar user al cargar fotos)
    this.user = this.database.userTemp;
    // validación para que exista un User seleccionado
    if (this.user === null || this.user === undefined) {
      this.navCtrl.navigateRoot(['/dashboard/app/home']);
    }
    // devuelve el usuario logeado actualmente
    this.authSvc.user$.subscribe( userLogged => {
      this.userLogged = userLogged;
    });
    // devuelve la colección photosPortfolio del User
    this.database.getPhotosPortfolio(this.user.uid).subscribe( res => {
      this.photos = res;
    });
  }

   // bloqueo de slide
   ionViewDidEnter(){
    this.slides.lockSwipes(true);
  }

  openPhoto( photo: Photo ) {
    this.database.photoTemp = photo.img;
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
