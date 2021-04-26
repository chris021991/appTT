import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss'],
})
export class EditPackageComponent implements OnInit {

  genre = '';
  package = '';
  duration = '';
  clothing = '';
  locations = '';
  digitalPhotos = null;
  phisicalPhotos = null;
  photobook = '';
  val1 = true;
  val2 = false;
  prices = '';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  onSave() {}

}
