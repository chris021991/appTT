import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { User, Roles } from '../models/interfaces';
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

  //variable para saber si el usuario está logueado
  user$: Observable<User>;
  userLogged: User;
  user: User;

  constructor(private afAuth: AngularFireAuth, 
              private afs: AngularFirestore,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private router: Router ) {
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
    )
  } //final del constructor

  //método para login
  // async login(email: string, password: string): Promise<User> {
  //   try {
  //     const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
  //     //actualiza la información del Usuario logueado
  //     this.updateUserData(user);    
  //     return user;
  //   } catch (error) {
  //     console.log('Login error -->', error)
  //   }
  // }

  //método para login con cuenta de Google
  // async loginGoogle(): Promise<User> {
  //   const googleUser = await Plugins.GoogleAuth.signIn();   
  //   const idToken = googleUser.authentication.idToken;
  //   const accessToken = googleUser.authentication.accessToken;
  //   const { user } = await this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(idToken,accessToken));   
  //   this.updateUserData(user); 
  //   return user;
  // }

  //método para logout
  // async logout(): Promise<void> {
  //   try {
  //     await this.afAuth.signOut();
  //   } catch (error) {
  //     console.log('Logout error->', error);
  //   }
  // }

  //método para registro
  // async register(email: string, password: string, role: Roles): Promise<User> {
  //   try {
  //     const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);
  //     this.sendVerificationEmail();
  //     this.updateUserData(user);      
  //     return user;
  //   } catch (error) {
  //       console.log('Error->', error)
  //   }
  // }

  private updateUserGoogleData(user: User) {
    const roleSelected = 'PHOTOGRAPHER';
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: roleSelected
    };
    
    return userRef.set(data, { merge: true })
  }

  //método de reseteo de contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error->', error)
    }
  }

  // getCurrentUser(): User {
    //   let user_string = localStorage.getItem("currentUser");
    //   if (!isNullOrUndefined(user_string)) {
      //     let user: User = JSON.parse(user_string);
      //     return user;
      //   } else {
        //     return null;
        //   }
        // }

  //recuperación de usuario
  getCurrentUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }
        
  //método para verificar si el email ha sido verificado
  // isEmailVerified(user: User) {
  //   return user.emailVerified === true ? true : false;
  // }

  //método para envia mail de verificacion de correo electrónico
  // async sendVerificationEmail(): Promise<void> {
  //   try { 
  //     console.log('Enviando correo de verificación');
  //     return (await this.afAuth.currentUser).sendEmailVerification();
  //   } catch (error) {
  //     console.log('Error enviando correo de verificación', error);
  //   }
  // }







  //nuevas funciones

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
        if(!data.user.emailVerified){
          loading.dismiss();
          this.toast('Por favor verifique su dirección de correo electrónico', 'warning');
          this.afAuth.signOut();
        } else {
          loading.dismiss();
          this.router.navigate(['/welcome']);
        }
      })
      .catch(error => {
        loading.dismiss();
        this.toast(error.message, 'danger');
      })
    }) 
    .catch(error => {
      loading.dismiss();
      this.toast(error.message, 'danger');
    });
  } //fin de signIn

  //nuevo goolge Signin
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
      this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(idToken,accessToken))
      .then((data) => {
        if(!data.user.emailVerified){
          loading.dismiss();
          this.toast('Por favor verifique su dirección de correo electrónico', 'warning');
          this.afAuth.signOut();
        } else {
          loading.dismiss();
          this.updateUserGoogleData(data.user)
          this.router.navigate(['/welcome']);
        }
      });      
    })
  }

  async signOut(){
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();

    this.afAuth.signOut()
    .then(() => {
      loading.dismiss();
      this.router.navigate(['/login'])
    })
  }// fin signOut

  async toast(message, status){
    const toast = await this.toastCtrl.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  } // fin del toast
}
