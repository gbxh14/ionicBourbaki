import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBreadcrumb, IonBreadcrumbs, IonList, IonItem, IonBadge, IonLabel, IonCardContent, IonCard, IonModal, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { initializeApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.prod';
import { FirestoreService } from '../services/firebase.service';
import { AvailableBooking } from '../models/availableBooking.model';
import { add, cashOutline, logoIonic, archiveOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.page.html',
  styleUrls: ['./my-bookings.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonModal, IonCard, IonCardContent, IonLabel, IonBadge, IonItem, IonList, IonBreadcrumb, IonBreadcrumbs, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MyBookingsPage implements OnInit {

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  db = getFirestore(this.app);

  myBookings: any[] = [];
  isModalOpen = false;
  reservaActual: any;

  currentUserEmail = '';

  title = 'Mis pedidos';
  constructor(
    private firestoreService: FirestoreService,
  ) {
    this.currentUserEmail = this.auth.currentUser?.email ?? '';
    addIcons({ cashOutline, archiveOutline, logoIonic });
  }


  ngOnInit() {
    this.getAllMyBookings();
  }

  getAllMyBookings() {
    this.firestoreService.getCollectionChanges<any[]>('Bookings').subscribe(result => {
      console.log(result);
      console.log('Busca', this.auth.currentUser?.email);
      let aux = result.filter(r => (r.type === 'shirt-booking' || r.type === 'bourbaki-food-booking'));
      aux = aux.filter(r => r.user === this.currentUserEmail);
      console.log(aux);
      this.myBookings = aux;
    });
  }

  transaleType(type: string) {
    if (type === 'shirt-booking') {
      return 'Reserva de camiseta';
    } else if (type === 'bourbaki-food-booking') {
      return 'Reserva de comida borbaki';
    } else {
      return 'Tipo desconocido';
    }
  }

  setModalOpen(isOpen: boolean, reserva: any) {
    this.isModalOpen = isOpen;
    if (reserva) {
      this.reservaActual = reserva;
    }
  }

}
