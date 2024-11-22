import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBreadcrumb, IonBreadcrumbs, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton, IonToast, IonIcon, IonList, IonModal, IonButtons, IonBadge, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { AvailableBooking } from '../models/availableBooking.model';
import { FirestoreService } from '../services/firebase.service';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.prod';
import { initializeApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { add, scanOutline } from 'ionicons/icons';
import { update } from '@angular/fire/database';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { addIcons } from 'ionicons';
import { NativeAudio } from '@capacitor-community/native-audio'

NativeAudio.preload({
  assetId: "access-granted",
  assetPath: "access_granted.mp3",
  audioChannelNum: 1,
  isUrl: false
})

NativeAudio.setVolume({
  assetId: 'access-granted',
  volume: 1,
});

NativeAudio.preload({
  assetId: "access-denied",
  assetPath: "access_denied.mp3",
  audioChannelNum: 1,
  isUrl: false
})

NativeAudio.setVolume({
  assetId: 'access-denied',
  volume: 1,
});

@Component({
  selector: 'app-theatre-booking',
  templateUrl: './theatre-booking.page.html',
  styleUrls: ['./theatre-booking.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonIcon, ReactiveFormsModule, IonToast, IonButton, IonSelect, IonSelectOption, IonItem, IonCardContent, IonCard, IonBreadcrumb, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBreadcrumbs]
})
export class TheatreBookingPage implements OnInit {

  title = 'Entradas para la gala';

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  db = getFirestore(this.app)

  isToastOpen = false;
  allTicketsBookings: any[] = [];

  currentUserEmail = this.auth.currentUser?.email;
  totalTicketsOfUser = 0;
  myTickets: any[] = [];

  scanResult = '';

  ticketsForm!: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
  ) {
    addIcons({ scanOutline });
  }

  ngOnInit() {
    this.buildTicketsForm();
    this.getAllTicketsBookings();
    this.getAllMyBookings();
    NativeAudio.play({ assetId: "access-granted" });
  }

  bookTickets() {
    console.log('Reservando entradas');
    console.log(this.ticketsForm.value);

    const booking_id = this.allTicketsBookings.length + 1;
    const booking = {
      user: this.currentUserEmail,
      type: 'theatre-booking',
      quantity: this.ticketsForm.value.numberOfTickets,
      validated: false,
      id: booking_id,
    };

    setDoc(doc(this.db, 'Bookings', `reserva_tickets_${booking_id}`), booking).then(() => {
      console.log('Reserva añadida correctamente');
      this.setToastOpen(true);
      this.ticketsForm.reset();
    }).catch(err => {
      console.error('Error al añadir la reserva', err);
    });
  }

  setToastOpen(open: boolean) {
    this.isToastOpen = open;
  }

  getAllTicketsBookings(paid?: boolean) {
    this.firestoreService.getCollectionChanges<any[]>('Bookings').subscribe(result => {
      let aux = result.filter(r => r.type === 'theatre-booking')
      if (paid !== undefined) {
        aux = aux.filter(r => r.paid === paid);
      }
      this.allTicketsBookings = aux;
    });

  }

  getAllMyBookings() {
    this.firestoreService.getCollectionChanges<any[]>('Bookings').subscribe(result => {
      console.log(result);
      console.log('Busca', this.currentUserEmail);
      let aux = result.filter(r => (r.type === 'theatre-booking'));
      aux = aux.filter(r => r.user === this.currentUserEmail);
      console.log(aux);
      this.myTickets = aux;
    });
  }
  // CÓDIGO PARA EL ESCANEO DE QR
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
        // Aquí se puede hacer algo con el resultado del escaneo
        // Si el escaneo ha ido bien, me devuelve el email del usuario

        // Busco las entradas asociadas a ese email
        const tickets = this.allTicketsBookings.filter(t => t.user === this.scanResult);
        let id = tickets[0].id;
        getDoc(doc(this.db, 'Bookings', `reserva_tickets_${id}`)).then(res => {
          if (res.exists()) {
            if (res.data()['validated'] === true) {
              console.log('La entrada ya ha sido validada');
              NativeAudio.play({ assetId: "access-denied" });
            }
            else {
              // Actualizamos el documento: validadas = true
              NativeAudio.play({ assetId: "access-granted" });
              const bookingToUpdate = doc(this.db, 'Bookings', `reserva_tickets_${id}`);
              updateDoc(bookingToUpdate, {
                validated: true
              });
            }
          }
        });
        this.totalTicketsOfUser = tickets[0].quantity;
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



  private buildTicketsForm() {
    this.ticketsForm = new FormGroup({
      numberOfTickets: new FormControl<string>('', [Validators.required]),
    });
  }

}
