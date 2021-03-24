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

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator{

  public userLogged: User;

  //variable para saber si el usuario está logueado
  public user$: Observable<User>;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    super();
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    )
  }

  //método para login
  async login(email: string, password: string): Promise<User> {
    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
      //actualiza la información del Usuario logueado
      this.updateUserData(user);    
      return user;
    } catch (error) {
      console.log('Login error -->', error)
    }
  }

  //método para login con cuenta de Google
  // async loginGoogle(roleSelected?: Roles): Promise<User> {
  //   try {
  //     const { user } = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  //     console.log(user);
  //     this.updateUserData(user, roleSelected);
  //     return user;
  //   } catch (error) {
  //     console.log('LoginGoogle error->', error)
  //   }
  // }

  async loginGoogle(): Promise<User> {
    const googleUser = await Plugins.GoogleAuth.signIn();   
    const idToken = googleUser.authentication.idToken;
    const accessToken = googleUser.authentication.accessToken;
    const { user } = await this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(idToken,accessToken));
    this.updateUserData(user); 
    return user;
  }

  //método para logout
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log('Logout error->', error);
    }
  }

  //método para registro
  async register(email: string, password: string, role: Roles): Promise<User> {
    try {
      const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);
      this.sendVerificationEmail();
      this.updateUserData(user);      
      return user;
    } catch (error) {
        console.log('Error->', error)
    }
  }

  private updateUserData(user: User , roleSelected?: Roles) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL
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
  isEmailVerified(user: User) {
    return user.emailVerified === true ? true : false;
  }

  //método para envia mail de verificacion de correo electrónico
  async sendVerificationEmail(): Promise<void> {
    try { 
      console.log('Enviando correo de verificación');
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log('Error enviando correo de verificación', error);
    }
  }
}
