import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from '../../models/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-genres-selected',
  templateUrl: './genres-selected.component.html',
  styleUrls: ['./genres-selected.component.scss'],
})
export class GenresSelectedComponent implements OnInit {

  @Input() user: User;

  genres: any;
  genresPath = 'photo_genres';
  genresSelected: any;
  prueba: boolean;

  constructor(private afs: AngularFirestore,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.getGenres();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  getGenres() {
    this.afs.collection(this.genresPath).valueChanges().subscribe((genres) => {
      this.genres = genres;
    });
  }

  getGenresSelected() {
    this.afs.collection('users').doc(this.user.uid).valueChanges().subscribe((genresSelected) => {
      this.genresSelected = genresSelected;
    });
  }

  updatePrueba(genre: any){
    console.log(genre.id, this.prueba);
  }

}
