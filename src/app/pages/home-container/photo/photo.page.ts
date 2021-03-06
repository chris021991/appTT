import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirestoreService } from '../../../services/firestore.service';
import { Photo } from '../../../models/interfaces';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {

  image: Photo;

  constructor(private navCtrl: NavController,
              private firestoreSvc: FirestoreService) { }

  ngOnInit() {
    this.image = this.firestoreSvc.photoTemp;
    if (!this.image){
      this.navCtrl.navigateRoot(['/']);
    }
  }

  back() {
    this.navCtrl.navigateBack([]);
  }

}
