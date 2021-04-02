import { Component, OnInit } from '@angular/core';
import { User } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  user: User;

  constructor(private authSrv: AuthService) {}

  async ngOnInit(){
    this.authSrv.user$.subscribe(user => {
      this.user = user;
    });
  }

}
