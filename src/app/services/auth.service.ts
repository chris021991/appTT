import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { User } from '../models/interfaces';
import { switchMap, first } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/auth';
import { RoleValidator } from '../helpers/role-validator';

import { Plugins } from '@capacitor/core';
import '@codetrix-studio/capacitor-google-auth';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator{

  // variable para saber si el usuario está logueado
  user$: Observable<User>;
  user: User;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private router: Router) {
    super();
    this.user$ = this.afAuth.authState
    .pipe(
      switchMap( user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  } // final del constructor

  // Método para login
  async signIn(email: string, password: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Autenticando...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      this.afAuth.signInWithEmailAndPassword(email, password)
      .then((data) => {
        const userRef = this.getCurrentUser();
        if (!data.user.emailVerified){
          loading.dismiss();
          this.toast('Por favor verifique su dirección de correo electrónico', 'warning');
          this.afAuth.signOut();
        } else {
          loading.dismiss();
          // this.router.navigate(['/welcome']);
        }
      })
      .catch(error => {
        loading.dismiss();
        this.toast(error.message, 'danger');
      });
    })
    .catch(error => {
      loading.dismiss();
      this.toast(error.message, 'danger');
    });
  } // fin de signIn

  // Método para login con Google
  async singInGoogle() {
    const googleUser = await Plugins.GoogleAuth.signIn();
    const idToken = googleUser.authentication.idToken;
    const accessToken = googleUser.authentication.accessToken;

    const loading = await this.loadingCtrl.create({
      message: 'Autenticando...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(idToken, accessToken))
      .then((data) => {
          loading.dismiss();
          this.updateUserGoogleData(data.user);
          this.router.navigate(['/welcome']);
      })
      .catch(error => {
        this.toast(error.message, 'danger');
      });
    });
  }

  private updateUserGoogleData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true });
  }

  // signOut
  async signOut(){
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();

    this.afAuth.signOut()
    .then(() => {
      loading.dismiss();
      this.router.navigate(['/login']);
    });
  }// fin signOut

  // método de reseteo de contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error->', error);
    }
  }// fin resetPassword

  // recuperación de usuario
  getCurrentUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }// fin getCurrentUser

  async toast(message, status){
    const toast = await this.toastCtrl.create({
      message,
      color: status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  } // fin del toast
}
