import { Component, OnInit } from '@angular/core';
import { Collection } from '../../models/interfaces';
import { FirestoreService } from '../../services/firestore.service';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { CollectionComponent } from '../../components/collection/collection.component';
import { NewCollectionComponent } from '../../components/collection/new-collection/new-collection.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {

  collections: Collection[] = [];
  private path = 'collections';

  constructor(private database: FirestoreService,
              private modalCtrl: ModalController,
              private routerOutlet: IonRouterOutlet) { }

  ngOnInit() {
    this.getCollections();
  }

  getCollections(){
    this.database.getCollectionChanges<Collection>(this.path).subscribe( res => {
            console.log('Collections ->', res);
            this.collections = res;
    });
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: NewCollectionComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      showBackdrop: true
    });
    return await modal.present();
  }

}
