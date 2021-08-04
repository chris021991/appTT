import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, ModalController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { User, Photo, Valoracion } from '../../../models/interfaces';
import { FirestoreService } from '../../../services/firestore.service';
import { UIServicesService } from '../../../services/ui-services.service';
import { PhotoPortfolioComponent } from '../../../components/photo-portfolio/photo-portfolio.component';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { GenresSelectedComponent } from 'src/app/components/genres-selected/genres-selected.component';

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
  event: any;
  genresSelected = [];
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

  constructor(private database: FirestoreService,
              private authSvc: AuthService,
              private uiService: UIServicesService,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private route: Router,
              private afs: AngularFirestore) { }

  ngOnInit() {
    // usuario temporal enviado desde el componente account (pendiente actualizar user al cargar fotos)
    this.user = this.database.userTemp;
    // validación para que exista un User seleccionado
    if (!this.user) {
      this.navCtrl.navigateRoot(['/dashboard/app/home']);
    } else {
      // devuelve la colección photosPortfolio del User
      this.database.getPhotosPortfolio(this.user.uid).subscribe( res => {
        this.photos = res;
      });
      // devuelve el usuario logeado actualmente
      this.authSvc.user$.subscribe( userLogged => {
        this.userLogged = userLogged;
      });
      // devuelve los estilos fotográficos
      this.getPhotoGenres();
    }
    this.getRanking();
  }

   // bloqueo de slide
   ionViewDidEnter(){
    this.slides.lockSwipes(true);
  }

  getPhotoGenres() {
    this.afs.collection('photo_genres').valueChanges().subscribe(res => {
      this.genresSelected = res;
    });
  }

  openPhoto( photo: Photo ) {
    this.database.photoTemp = photo;
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

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: GenresSelectedComponent,
      componentProps: {
        user: this.user
      }
    });
    return await modal.present();
  }

  // valida el value del segment
  segmentChanged(ev: any) {
    this.event = ev.detail.value;
    if (ev.detail.value === 'portfolio'){
      this.slideToPortfolio();
    } else if (ev.detail.value === 'bio'){
      this.slideToBio();
    } else if (ev.detail.value === 'packs'){
      this.slideToPacks();
    }
  }

  getRanking() {
    const path = 'users/' + this.user.uid + '/valoraciones';
    this.database.getCollectionChanges<Valoracion>(path).subscribe(val => {
        const valoraciones = val;
        const n = valoraciones.length;
        let acum = 0;
        // Suma de todas las valoraciones y calcula el promedio
        for (let i = 0; i < n; i++) {
          acum = Number(acum) + Number(valoraciones[i].value);
        }
        const prom = acum / n;
        // Si nunca se ha valorado al usuario, el sistema le asigna 5 estrellas
        if (isNaN(prom)){
          this.valoracion = 5;
          this.setRanking(this.valoracion);
        } else {
          this.valoracion = prom;
          this.setRanking(this.valoracion);
        }
    });
  }

  // Loop para mostrar número de estrellas
  setRanking(val: number) {
    const rtgs = this.ratings;
    this.valoracion = val;
    for (let i = 0; i < rtgs.length; i++) {
      if (i < val) {
        rtgs[i].icon = 'star';
      } else {
        rtgs[i].icon = 'star-outline';
      }
    }
  }

  // métodos para deslizar sliders
  private slideToPortfolio(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }
  private slideToBio(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }
  private slideToPacks() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(2);
    this.slides.lockSwipes(true);
  }

}
