import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonTitle, IonToolbar, LoadingController, IonAlert, IonModal, IonButtons, IonButton, IonLabel, IonList, IonListHeader } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, atCircleOutline, atOutline, exit, exitOutline, lockClosedOutline, personOutline, airplane, chatbubbleEllipsesOutline, bagOutline, ticketOutline } from 'ionicons/icons';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { } from '@angular/fire/app';
import { } from '@angular/fire/auth';
import { environment } from 'src/environments/environment.prod';
import { signOut } from '@firebase/auth';
import { inject, Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Auth } from '@angular/fire/auth';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { FirestoreService } from '../services/firebase.service';
import { Song } from '../models/song.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonListHeader, IonList, IonLabel, IonButton, IonButtons, IonModal, IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem]
})
export class HomePage implements AfterViewInit {

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);

  title = 'Inicio';
  currentUserName = '';
  isModalOpen = false;
  rogativas: string[] = [];
  constructor(
    private authService: AuthService,
    private route: Router,
    private firestoreService: FirestoreService
  ) {
    addIcons({ chatbubbleEllipsesOutline, bagOutline, ticketOutline, exitOutline, airplane, arrowForwardOutline });
  }

  ngAfterViewInit(): void {
    this.currentUserName = this.auth.currentUser?.displayName || '';
    console.log('Nombre de usuario actual', this.currentUserName);
  }

  onSignOut() {
    signOut(this.auth).then(() => {
      this.route.navigate(['./login']);
    }).catch((error) => {
      console.error('Error al cerrar sesión', error);

    });
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.firestoreService.getCollectionChanges<Song[]>('Songs').subscribe(result => {
      const allSongs = result as Song[];
      allSongs.forEach(song => {
        this.splitByDoubleSpaces(song.lyrics);
      });
    })
  }

  private splitByDoubleSpaces(text: string) {
    // Use a regular expression to split the text at every occurrence of two consecutive spaces
    let lines = text.split(/ {2}/);
    // Print each line
    lines.forEach(line => {
      this.rogativas.push(line);
    });
  }

}
