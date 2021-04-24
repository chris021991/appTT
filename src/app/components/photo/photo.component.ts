import { Component, OnInit, Input } from '@angular/core';
import { Photo, User } from '../../models/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-photo-component',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnInit {

  @Input() image: Photo;
  user: User = {};

  constructor(private afs: AngularFirestore,
              private database: FirestoreService) { }

  ngOnInit() {
    this.afs.collection('users').doc(this.image.createdBy).valueChanges().subscribe((res) => {
      this.user = res;
    });
  }

  onClick() {}

}
