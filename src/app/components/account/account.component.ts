import { Component, OnInit, Input } from '@angular/core';
import { User, Photo } from '../../models/interfaces';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  @Input() user: User = {};
  @Input() page = '';

  photos: Photo[];

  img1 = '/assets/perro-1.jpg';
  img2 = '/assets/perro-2.jpg';
  img3 = '/assets/perro-3.jpg';

  constructor(private database: FirestoreService,
              private route: Router) { }

  ngOnInit() {
    this.getPhotosPortfolio();
  }

  // recupera la colección photosPorfolio de cada User
  getPhotosPortfolio() {
    this.database.getPhotosPortfolio(this.user.uid).subscribe((res) => {
      this.photos = res;
    });
  }

  openPortfolio() {
    this.database.userTemp = this.user;
    this.route.navigate(['/dashboard/app/home/portfolio']);
  }

  openPhoto( photo: Photo ) {
    this.database.photoTemp = photo;
    this.route.navigate(['/dashboard/app/home/photo']);
  }

}
