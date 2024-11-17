import { inject, Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { User } from '../models/user.model';
import { Auth } from '@angular/fire/auth';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private route: Router
  ) { }

  /*
  loginUser(value: User) {
  if (value.email && value.password) {
    signInWithEmailAndPassword(auth, value.email, value.password)
      .then((userCredential) => {
        // Signed in 
        this.route.navigate(['./tabs/home']);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  } else {
    console.log('Email or password is undefined');
  }
  }
  */

  // Reset password
  passwordReset(value: User) {
    return new Promise<any>((resolve, reject) => {
      if (value.email) {
        firebase.auth().sendPasswordResetEmail(value.email)
          .then(
            res => resolve(res), // correo enviado correctamente
            err => reject(err)); // error al enviar correo
      } else {
        reject(new Error('Email is undefined'));
      }
    });
  }

  // Logout
  logoutUser() {
    return new Promise<void>((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut()
          .then(() => {
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    });
  }

  // Details user
  userDetails() {
    return firebase.auth().currentUser;
  }

/*
  getCurrenUser(): User{
   const currUser: User = {
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || ''
   };
   return currUser;
  }
   */
}
