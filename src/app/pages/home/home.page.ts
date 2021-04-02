import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  users: User[] = [];
  private path = 'users';
  enable = true;

  constructor(private database: FirestoreService ) { }

  ngOnInit() {
    this.users = [];
    this.loadData();
  }

  async loadData( event? ) {

    const data = await this.database.getPhotographers<User>(this.path);

    this.users.push( ...data );

    if ( event ) {
      event.target.complete();
      if ( data.length === 0 ) {
        this.enable = false;
      }
    }
  }

  doRefresh( event ){
    console.log('Event', event.target);
    this.users = [];
    this.database.lastDocument = null;
    this.enable = true;
    this.loadData( event );
    console.log('Event2', event.target);
  }

}
