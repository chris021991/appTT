import { Component, OnInit } from '@angular/core';
import { CameraService } from '../../services/camera.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-portfolio',
  templateUrl: './popover-portfolio.component.html',
  styleUrls: ['./popover-portfolio.component.scss'],
})
export class PopoverPortfolioComponent implements OnInit {

  image = '';

  constructor(private cameraSvc: CameraService,
              private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  async addPhoto(source: string) {
    if (source === 'camera') {
      console.log('camera');
      const cameraPhoto = await this.cameraSvc.openCamera();
      this.image = 'data:image/jpg;base64,' + cameraPhoto;
    } else {
      console.log('library');
      const libraryImage = await this.cameraSvc.openLibrary();
      this.image = 'data:image/jpg;base64,' + libraryImage;
    }
    this.popoverCtrl.dismiss({
      image: this.image
    });
  }

}
