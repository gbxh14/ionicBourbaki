import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonTitle, IonToolbar, LoadingController, IonAlert, IonButton } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, atCircleOutline, atOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { } from '@angular/fire/app';
import { } from '@angular/fire/auth';
import { environment } from 'src/environments/environment.prod';
import { sendPasswordResetEmail } from '@firebase/auth';
import { inject, Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Auth } from '@angular/fire/auth';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonButton, IonFab,
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
    IonAlert]
})
export class ResetPasswordPage implements OnInit {

  title = 'Restablece tu contraseña';

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);

  isAlertOpen = false;
  alertButtons = ['Cerrar'];

  resetForm!: FormGroup;
  constructor(
    private authService: AuthService,
    private route: Router
  ) {
    addIcons({ atOutline, arrowForwardOutline });
  }

  ngOnInit() {
    addIcons({ atOutline });
    this.buildForm();
  }

  resetPassword(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.isAlertOpen = true;
        this.resetForm.reset();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  setOpen(set: boolean) {
    this.isAlertOpen = set;
  }

  private buildForm() {
    this.resetForm = new FormGroup({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
    });
  }


}
