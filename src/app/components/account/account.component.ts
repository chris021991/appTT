import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/interfaces';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  @Input() user: User = {};

  img1 = '/assets/perro-1.jpg';
  img2 = '/assets/perro-2.jpg';
  img3 = '/assets/perro-3.jpg';

  constructor(private firestoreSrv: FirestoreService,
              private route: Router) { }

  ngOnInit() {}

  openPortfolio() {
    this.firestoreSrv.userTemp = this.user;
    this.route.navigate(['/dashboard/app/home/portfolio']);
  }

  openPhoto( photo ) {
    this.firestoreSrv.photoTemp = photo;
    this.route.navigate(['/dashboard/app/home/photo']);
  }

}
