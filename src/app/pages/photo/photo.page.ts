import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {

  image = '';

  constructor(private navCtrl: NavController,
              private firestoreSvc: FirestoreService) { }

  ngOnInit() {
    this.image = this.firestoreSvc.photoTemp;
  }

  back() {
    this.navCtrl.navigateBack([]);
  }

}
