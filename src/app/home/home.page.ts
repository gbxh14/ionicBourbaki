import { AfterViewInit, Component } from '@angular/core';
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
export class HomePage implements AfterViewInit {

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  // Fecha de compilación como version
  version = '1.0.2';
  title = 'Inicio';
  currentUserName = '';
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

  ngOnDestroy(): void {
    this.stopScan();
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
      const user = result.find(user => user.email === this.auth.currentUser?.email);
      this.qrInfo = `${user?.name ?? ''}`;
      console.log('QR Info', this.qrInfo);
    });
  }

  async checkPermission() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async startScan() {
    console.log('Starting scan');
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      const body = document.querySelector('body');
      if (body) {
        body.classList.add('scanner-active');
      }
      const result = await BarcodeScanner.startScan();
      console.log('Scanned', result);
      if (result.hasContent) {
        this.scanResult = result.content;
        BarcodeScanner.showBackground();
        document.querySelector('body')?.classList.remove('scanner-active');
        console.log('Scan result', this.scanResult);
      }
    } catch (err) {
      console.error(err);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan().then(() => {
      const body = document.querySelector('body');
      if (body) {
        body.classList.remove('scanner-active');
      }
    });
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
