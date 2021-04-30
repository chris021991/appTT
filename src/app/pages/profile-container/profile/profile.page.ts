import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/interfaces';
import { AuthService } from '../../../services/auth.service';
import { NavController } from '@ionic/angular';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User = {
    displayName: '',
    email: '',
    phone: null
  };

  private path = 'users';
  disableInput = true;

  constructor(private authSrv: AuthService,
              private database: FirestoreService,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.authSrv.user$.subscribe(user => {
      this.user = user;
    });
  }

  edit() {
      this.disableInput = false;
  }

  async update() {
    await this.database.updateDocument(this.user , this.path, this.user.uid);
    this.disableInput = true;
  }

  openPhotoProfile() {
    this.navCtrl.navigateRoot(['/photo-changes'], {animated: true});
  }

}
