import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  user: User;

  constructor(private authSrv: AuthService) {}

  async ngOnInit(){
    this.authSrv.user$.subscribe(user => {
      this.user = user;
    });
  }

}
