import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/interfaces';
import { AuthService } from '../../../services/auth.service';
import { NavController, LoadingController, PickerController } from '@ionic/angular';
import { FirestoreService } from '../../../services/firestore.service';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User = {
    displayName: '',
    email: '',
    phone: null,
    country: '',
    city: ''
  };

  cities = [];

  private path = 'users';
  disableInput = true;

  constructor(private authSrv: AuthService,
              private location: LocationService,
              private database: FirestoreService,
              private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private pickerCtrl: PickerController) { }

  ngOnInit() {
    this.authSrv.user$.subscribe(user => {
      this.user = user;
      this.cities = this.location.cities;
      this.user.country = 'Ecuador';
    });
  }

  edit() {
      this.disableInput = false;
  }

  async update() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    await this.database.updateDocument(this.user , this.path, this.user.uid)
    .then(() => {
      loading.dismiss();
    })
    .catch (error => {
      console.log('Error ->', error.message);
      loading.dismiss();
    });
  }

  openPhotoProfile() {
    this.navCtrl.navigateRoot(['/photo-changes'], {animated: true});
  }

  // Corregir tamaño de arreglo cities
  async openPicker(numColumns = 1, numOptions = 37, columnOptions = this.cities){
    const picker = await this.pickerCtrl.create({
      columns: this.getColumns(numColumns, numOptions, columnOptions),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: (value) => {
            picker.onDidDismiss().then(async data => {
              const col = await picker.getColumn('col-0');
              this.user.city = col.options[col.selectedIndex].text;
            });
          }
        }
      ]
    });

    await picker.present();

  }

  getColumns(numColumns, numOptions, columnOptions) {
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }
    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions) {
    const options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      });
    }
    return options;
  }

}
