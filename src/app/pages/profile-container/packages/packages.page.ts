import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { NavController, ModalController } from '@ionic/angular';
import { NewPackageComponent } from '../../../components/package/new-package/new-package.component';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {

  genre: any = null;
  packages: any = null;

  constructor(private database: FirestoreService,
              private navCtrl: NavController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.genre = this.database.genre;
    if (this.genre === null) {
      this.navCtrl.navigateRoot(['/dashboard/app/settings/genres']);
    } else {
      this.getPackages(this.genre);
    }
  }

  addPackage() {
    this.presentModal();
  }

  private getPackages(genre: any) {
    this.database.getCollectionChanges(`photo_genres/${genre.id}/packages`).subscribe((packages) => {
      this.packages = packages;
    });
  }

  private async presentModal() {
    const modal = await this.modalCtrl.create({
      component: NewPackageComponent,
      componentProps: {
        genre: this.genre,
      }
    });
    return await modal.present();
  }

}
