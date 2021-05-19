import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { IonList, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-genres',
  templateUrl: './genres.page.html',
  styleUrls: ['./genres.page.scss'],
})
export class GenresPage implements OnInit {

  @ViewChild(IonList) ionList: IonList;

  genres: any;
  id = '';
  genre: '';
  description: '';
  path = 'photo_genres';

  constructor(private database: FirestoreService,
              private afs: AngularFirestore,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.database.getCollectionChanges(this.path).subscribe((res) => {
      this.genres = res;
    });
  }

  async deleteGenre(genre: any) {
    this.ionList.closeSlidingItems();
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.alertCtrl.dismiss();
          }
        }, {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingCtrl.create();
            await loading.present();

            // Elimina todas las colecciones dentro de packages
            this.afs.collection(this.path).doc(genre.id).collection('packages').ref.get()
            .then((query) => {
              query.forEach((doc) => {
                doc.ref.delete().then(() => {
                  console.log('Documento eliminado con éxito');
                // tslint:disable-next-line: only-arrow-functions
                }).catch(function(error) {
                  console.log('Error eliminando documento: ', error);
                });
              });
            })
            .then(async () => {
              // Elimina documento
              this.database.deleteDocument(this.path, genre.id);
              await loading.dismiss();
              // tslint:disable-next-line: no-shadowed-variable
              const alert = await this.alertCtrl.create({
                header: 'Completado',
                message: '¡Se ha eliminado correctamente!',
                buttons: ['OK']
              });
              await alert.present();
              console.log('Documento eliminado');
            })
            // tslint:disable-next-line: only-arrow-functions
            .catch(function(error) {
              console.log('Error Obteniendo Documentos: ', error);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  editGenre(genre: any) {
    this.ionList.closeSlidingItems();
    this.presentAlert('Editar género fotográfico', '', genre);
  }

  openGenre(genre: any) {
      this.database.genre = genre;
      this.navCtrl.navigateRoot(['/dashboard/app/settings/genres/packages'], {animated: true});
  }

  addGenre() {
    this.presentAlert('Crear género fotográfico', '');
  }

  async presentAlert(header: string, message: string, genre?: any) {
    const genreId = this.afs.createId();
    const alert = await this.alertCtrl.create({
      header,
      message,
      inputs: [
        {
          name: 'name',
          type: 'text',
          id: 'name',
          value: genre?.name,
          placeholder: 'Nombre'
        },
        // multiline input.
        {
          name: 'description',
          id: 'description',
          type: 'textarea',
          value: genre?.description,
          placeholder: 'Descripción'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Guardar',
          handler: (data) => {
            if (genre?.id){
              this.afs.collection(this.path).doc(genre.id).set({
                  name: data.name,
                  description: data.description
                }, {merge: true});
            } else {
              this.afs.collection(this.path).doc(genreId).set({
                id: genreId,
                name: data.name,
                description: data.description
              }, {merge: true});
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
