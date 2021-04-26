import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-open-package',
  templateUrl: './open-package.component.html',
  styleUrls: ['./open-package.component.scss'],
})
export class OpenPackageComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

}
