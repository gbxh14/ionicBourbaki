import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonTitle, IonToolbar, LoadingController, IonAlert, IonInputPasswordToggle } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, atCircleOutline, atOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { } from '@angular/fire/app';
import { } from '@angular/fire/auth';
import { environment } from 'src/environments/environment.prod';
import { } from '@firebase/auth';
import { inject, Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Auth } from '@angular/fire/auth';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonAlert, IonFab,
    IonIcon,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    RouterLink,
    IonFabButton,
    ReactiveFormsModule,
    IonInputPasswordToggle]
})
export class LoginPage implements OnInit {

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);

  title = 'Inicia sesión';
  isAlertOpen = false;
  alertButtons = ['Cerrar'];

  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private route: Router,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ atOutline, lockClosedOutline, arrowForwardOutline, atCircleOutline, personOutline });
  }

  ngOnInit() {
    addIcons({ personOutline });
    this.buildForm();
  }

  signIn() {
    const userToLogin = this.loginForm.value as User;
    console.log(userToLogin);
    // this.authService.loginUser(userToLogin);
    if (userToLogin.email && userToLogin.password) {
      signInWithEmailAndPassword(this.auth, userToLogin.email, userToLogin.password)
        .then((userCredential) => {
          this.showLoading()
          console.log('Signed in');
          this.route.navigate(['./tabs/home']);
          // ...
        })
        .catch((error) => {
          this.isAlertOpen = true;
          console.log(error);
        });
    } else {
      console.log('Email or password is undefined');
    }
  }

  setOpen(set: boolean) {
    this.isAlertOpen = set;
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      duration: 2000,
    });

    loading.present();
  }

  private buildForm() {
    this.loginForm = new FormGroup({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    });
  }

}
