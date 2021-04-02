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
    this.authSrv.user$.subscribe(user => {
      this.user = user;
    });
    console.log();
  }

   onLogOut(){
    try{
      // tslint:disable-next-line: no-unused-expression
      this.authSrv.signOut;
      this.navCtrl.navigateRoot('/login');
    }catch (error){
      console.log(error);
    }
  }

}
