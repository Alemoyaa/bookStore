import { userInterface } from './../models/user';
import { AngularFirestore , AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { auth } from 'firebase/app';
import { promise } from 'protractor';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afsAuth: AngularFireAuth, private afs: AngularFirestore) { }

  registerUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afsAuth.auth.createUserWithEmailAndPassword(email, pass)
      .then(userData => {
        resolve(userData),
        this.updateUserData(userData.user)
      }).catch(err => console.log(reject(err)))
    });
  }

  loginEmailUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afsAuth.auth.signInWithEmailAndPassword(email, pass)
      .then( userData => resolve (userData),
      err => reject(err));
    });
  }

  loginFacebookUser() { // Cuando te creas una cuenta, automaticamente te loguea
    return this.afsAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()) // Dentro de este objeto viene el usuario q le vamos a pasar a updateUserData, para convertirlo en editor
    .then(credential => this.updateUserData(credential.user));
  }

  loginGoogleUser() {
    return this.afsAuth.auth.signInWithPopup( new auth.GoogleAuthProvider()) // Funcion para registrarnos con google
    .then(credential => this.updateUserData(credential.user));
  }

  logoutUser() {
    this.afsAuth.auth.signOut();
  }

  isAuth(){
    return this.afsAuth.authState.pipe(map(auth => auth)); // Comprueba si nuestro usuario esta logeado
  }

  private updateUserData(user) {  // Cada vez que registremos una usuario lo hacemos editor
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: userInterface = {
      id: user.uid,
      email: user.email,
      roles: {
        editor: true
      }
    }
    return userRef.set(data, {merge: true})
  }

  isUserAdmin(userUid){
    return this.afs.doc<userInterface>(`users/${userUid}`).valueChanges(); // Esto nos va a devolver el documento que corresponda con el userUid
  }

}
