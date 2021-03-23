import { Component, OnInit } from '@angular/core';
import { Collection } from '../../models/interfaces';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {

  collections: Collection[] = [];
  private path = 'collections';

  constructor( private database: FirestoreService ) { }

  ngOnInit() {
    this.getCollections();
  }

  getCollections(){
    this.database.getCollectionChanges<Collection>(this.path).subscribe( res => {
            console.log(res);
            this.collections = res;
    });
  }

}
