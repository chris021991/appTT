import { Component, OnInit, Input } from '@angular/core';
import { User, Roles } from '../../models/interfaces';
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
    this.authSrv.user$.subscribe(user => {
      this.user = user;
      console.log(user.photoURL);
      
    })
    console.log();
    
  }

  async onLogOut(){
    try{
      await this.authSrv.signOut;
      this.navCtrl.navigateRoot('/');
    }catch(error){
      console.log(error);
    }
  }

}
