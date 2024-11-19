import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBreadcrumb, IonBreadcrumbs, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton, IonToast, IonIcon, IonList, IonModal, IonButtons, IonBadge } from '@ionic/angular/standalone';
import { AvailableBooking } from '../models/availableBooking.model';
import { FirestoreService } from '../services/firebase.service';
import { addDoc, collection, getDoc, getDocs, getFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.prod';
import { initializeApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-shirt-booking',
  templateUrl: './shirt-booking.page.html',
  styleUrls: ['./shirt-booking.page.scss'],
  standalone: true,
  imports: [IonBadge, IonButtons, IonModal, IonList, IonIcon, IonToast, IonButton, ReactiveFormsModule, IonInput, IonLabel, IonSelect, IonSelectOption, IonItem, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonBreadcrumb, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBreadcrumbs]
})
export class ShirtBookingPage implements OnInit {

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  db = getFirestore(this.app);

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

  bookingForm!: FormGroup;

  constructor(
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    if (this.currentUserEmail !== 'admin@admin.es') {
      this.getBooking();
      this.buildForm();
    } else {
      this.getAllShirtBookings();
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
    // Guardamos en la BD la reserva
    const reservas = collection(this.db, 'Bookings');
    const booking = {
      color,
      size,
      price,
      user,
      quantity,
      paid: false,
      collected: false,
      date: new Date().toISOString(),
      type: 'shirt-booking'
    };
    console.log('Reserva', booking);
    addDoc(reservas, booking).then(() => {
      console.log('Reserva añadida correctamente');
      this.setToastOpen(true);
    }).catch(err => {
      console.error('Error al añadir la reserva', err);
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

  getAllShirtBookings() {
    this.firestoreService.getCollectionChanges<any[]>('Bookings').subscribe(result => {
      this.allShirtBookings = result.filter(r => r.type === 'shirt-booking');
      console.log('Reservas de camisetas', this.allShirtBookings);
    })
  }

  private calculatePrice() {
    const cantidad = this.bookingForm.get('quantity')?.value;
    const quotient = Math.floor(cantidad / 2);
    const remainder = cantidad % 2;
    return (quotient * this.precios[1]) + (remainder * this.precios[0]);
  }

  private buildForm() {
    this.bookingForm = new FormGroup({
      color: new FormControl<string>('', [Validators.required]),
      size: new FormControl<string>('', [Validators.required]),
      quantity: new FormControl<number>(0, [Validators.required]),
    });
  }



}
