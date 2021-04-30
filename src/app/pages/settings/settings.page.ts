import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/interfaces';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  user: User = {};
  role = '';

  constructor(private authSrv: AuthService,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.authSrv.user$.subscribe(user => {
      this.user = user;
      this.roleValidator(this.user);
    });
  }

  onProfile(){
    this.navCtrl.navigateRoot(['/dashboard/app/settings/profile'], {animated: true});
  }

  roleValidator(user: User) {
    if (user.role === 'ADMIN') {
      this.role = 'Administrador';
    } else if (user.role === 'PHOTOGRAPHER') {
      this.role = 'Fotógrafo';
    } else {
      this.role = 'Cliente';
    }
  }

  onLogOut(){
    try{
      this.authSrv.signOut();
      this.navCtrl.navigateRoot('/login');
    }catch (error){
      console.log(error);
    }
  }

}
