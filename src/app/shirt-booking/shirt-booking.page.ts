import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBreadcrumb, IonBreadcrumbs, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton, IonToast, IonIcon, IonList, IonModal, IonButtons, IonBadge, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { AvailableBooking } from '../models/availableBooking.model';
import { FirestoreService } from '../services/firebase.service';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.prod';
import { initializeApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { add, cashOutline, archiveOutline, scanOutline } from 'ionicons/icons';
import { update } from '@angular/fire/database';
import { addIcons } from 'ionicons';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-shirt-booking',
  templateUrl: './shirt-booking.page.html',
  styleUrls: ['./shirt-booking.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonBadge, IonButtons, IonModal, IonList, IonIcon, IonToast, IonButton, ReactiveFormsModule, IonInput, IonLabel, IonSelect, IonSelectOption, IonItem, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonBreadcrumb, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBreadcrumbs]
})
export class ShirtBookingPage implements OnInit {

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  db = getFirestore(this.app)

  currentUserEmail = this.auth.currentUser?.email;

  title = 'Reserva de camisetas';
  colores: string[] = [];
  tallas: string[] = [];
  cantidad: number = 0;
  precios: number[] = [];
  reserva!: AvailableBooking;

  isToastOpen = false;
  isModalOpen = false;
  allShirtBookings: any[] = [];
  reservaActual: any;
  allUserBookings: any[] = [];

  scanResult = '';
  errorValidating = false;

  bookingForm!: FormGroup;
  filterForm!: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
  ) {
    addIcons({ cashOutline, archiveOutline, scanOutline });
  }

  ngOnInit() {
    if (this.currentUserEmail !== 'admin@admin.es') {
      this.getBooking();
      this.buildBookingForm();
      this.getAllShirtBookings();
    } else {
      this.buildFilterForm();
      this.getAllShirtBookings(false);
    }
  }

  private getBooking(url: string = 'shirt-booking') {
    this.firestoreService.getCollectionChanges<AvailableBooking[]>('AvailableBookings').subscribe(result => {
      this.reserva = result.find(r => r.url === url) as AvailableBooking;
      console.log('Reserva', this.reserva);
      this.colores = this.reserva.availableColors;
      this.tallas = this.reserva.availableSizes;
      this.precios = [this.reserva.prizeByUnit, this.reserva.prize2Units];
    })
  }

  addBooking() {
    // Leemos el formulario
    const color = this.bookingForm.get('color')?.value;
    const size = this.bookingForm.get('size')?.value;
    const quantity = this.bookingForm.get('quantity')?.value;
    const price = this.calculatePrice();
    const user = this.currentUserEmail;
    const booking_id = this.allShirtBookings.length + 1;
    // Guardamos en la BD la reserva
    const booking = {
      color,
      size,
      price,
      user,
      quantity,
      paid: false,
      collected: false,
      date: new Date().toISOString().split('T')[0],
      type: 'shirt-booking',
      id: booking_id
    };
    console.log('Reserva', booking);
    setDoc(doc(this.db, 'Bookings', `reserva_camisetas_${booking_id}`), booking).then(() => {
      console.log('Reserva añadida correctamente');
      this.setToastOpen(true);
      this.bookingForm.reset();
    }).catch(err => {
      console.error('Error al añadir la reserva', err);
    });


  }

  setAsPaid() {
    this.reservaActual.paid = true;
    console.log('Reserva actual', this.reservaActual.id);
    let id = this.reservaActual.id;
    getDoc(doc(this.db, 'Bookings', `reserva_camisetas_${id}`)).then(res => {
      if (res.exists()) {
        // Actualizamos el documento: pagado = true
        const bookingToUpdate = doc(this.db, 'Bookings', `reserva_camisetas_${id}`);
        updateDoc(bookingToUpdate, {
          paid: true
        });
      }
    });

  }

  setAsCollected() {
    this.reservaActual.collected = true;
    console.log('Reserva actual', this.reservaActual.id);
    let id = this.reservaActual.id;
    getDoc(doc(this.db, 'Bookings', `reserva_camisetas_${id}`)).then(res => {
      if (res.exists()) {
        // Actualizamos el documento: pagado = true
        const bookingToUpdate = doc(this.db, 'Bookings', `reserva_camisetas_${id}`);
        updateDoc(bookingToUpdate, {
          collected: true
        });
      }
    });

  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  setModalOpen(isOpen: boolean, reserva: any) {
    this.isModalOpen = isOpen;
    if (reserva) {
      this.reservaActual = reserva;
    }
  }

  getAllShirtBookings(paid?: boolean) {
    this.firestoreService.getCollectionChanges<any[]>('Bookings').subscribe(result => {
      let aux = result.filter(r => r.type === 'shirt-booking')
      if (paid !== undefined) {
        aux = aux.filter(r => r.paid === paid);
      }
      this.allShirtBookings = aux;
    });

  }

  filterByPaymentStatus() {
    let estado = this.filterForm.get('paid')?.value;
    if (estado === true) { // camisetas pagadas
      console.log('Filtrando por pagado');
      this.getAllShirtBookings(true);
      console.log('Reservas pagadas', this.allShirtBookings);
    } else if (estado === false) { // camisetas no pagadas
      console.log('Filtrando por no pagado');
      this.getAllShirtBookings(false);
      console.log('Reservas no pagadas', this.allShirtBookings);
    } else {
      console.log('Todas las reservas');
      this.getAllShirtBookings();
    }
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

        // Busco las reservas asociadas a ese email
        this.allShirtBookings = this.allShirtBookings.filter(booking => booking.user === this.scanResult);
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



  private calculatePrice() {
    const cantidad = this.bookingForm.get('quantity')?.value;
    const quotient = Math.floor(cantidad / 2);
    const remainder = cantidad % 2;
    return (quotient * this.precios[1]) + (remainder * this.precios[0]);
  }

  private buildBookingForm() {
    this.bookingForm = new FormGroup({
      color: new FormControl<string>('', [Validators.required]),
      size: new FormControl<string>('', [Validators.required]),
      quantity: new FormControl([Validators.required]),
    });
  }

  private buildFilterForm() {
    this.filterForm = new FormGroup({
      paid: new FormControl<boolean>(false),
      collected: new FormControl<boolean>(false)
    });
  }


}
