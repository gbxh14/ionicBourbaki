import { AfterViewInit, Component, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonTitle, IonToolbar, IonModal, IonButtons, IonButton, IonLabel, IonList, IonListHeader } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, exitOutline, airplane, chatbubbleEllipsesOutline, bagOutline, ticketOutline, qrCodeOutline, scanOutline } from 'ionicons/icons';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment.prod';
import { signOut } from '@firebase/auth';
import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { FirestoreService } from '../services/firebase.service';
import { Song } from '../models/song.model';
import { QRCodeModule } from 'angularx-qrcode';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonList, IonLabel, IonButton, IonButtons, IonModal, IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    QRCodeModule]
})
export class HomePage implements AfterViewInit, OnChanges {

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  // Fecha de compilación como version
  version = '1.0.4';
  title = 'Inicio';
  currentUserName = '';
  currentUserEmail = this.auth.currentUser?.email;
  isModalOpen = false;
  isQrOpen = false;

  qrInfo = '';
  scanResult = '';

  rogativas: string[] = [];
  constructor(
    private authService: AuthService,
    private route: Router,
    private firestoreService: FirestoreService,
  ) {
    addIcons({ chatbubbleEllipsesOutline, bagOutline, ticketOutline, qrCodeOutline, exitOutline, scanOutline, airplane, arrowForwardOutline });
  }

  ngAfterViewInit(): void {
    this.currentUserName = this.auth.currentUser?.displayName || '';
    console.log('Nombre de usuario actual', this.currentUserName);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentUserName = this.auth.currentUser?.displayName || '';
    console.log('Nombre de usuario actual', this.currentUserName);
  }

  onSignOut() {
    signOut(this.auth).then(() => {
      this.currentUserName = '';
      this.route.navigate(['./login']);
    }).catch((error) => {
      console.error('Error al cerrar sesión', error);

    });
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.firestoreService.getCollectionChanges<Song[]>('Songs').subscribe(result => {
      const rogativas = result.filter(song => song.title === 'Rogativas');
      this.splitByDoubleSpaces(rogativas[0].lyrics);
    })
  }

  setQrOpen(isOpen: boolean) {
    this.setQrInfo();
    this.isQrOpen = isOpen;
  }

  setQrInfo() {
    this.firestoreService.getCollectionChanges<User[]>('User').subscribe(result => {
      this.qrInfo = this.auth.currentUser?.email ?? '';
      console.log('QR Info', this.qrInfo);
    });
  }

  goToPage(url: string) {
    this.route.navigate([url]);
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
