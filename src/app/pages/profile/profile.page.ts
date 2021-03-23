import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User;

  constructor(private authSrv: AuthService,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.user = this.authSrv.userLogged;
  }

  async onLogOut(){
    try{
      await this.authSrv.logout();
      this.navCtrl.navigateRoot('/', { animated: true });
    }catch(error){
      console.log(error);
    }
  }

}
