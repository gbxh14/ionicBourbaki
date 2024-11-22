import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBreadcrumb, IonBreadcrumbs, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonIcon, IonModal, IonButtons, IonButton } from '@ionic/angular/standalone';
import { initializeApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.prod';
import { FirestoreService } from '../services/firebase.service';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.page.html',
  styleUrls: ['./my-tickets.page.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonModal, IonIcon, IonLabel, IonItem, IonList, IonCardContent, IonCard, IonBreadcrumb, IonBreadcrumbs, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MyTicketsPage implements OnInit {

  title = 'Mis entradas';
  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  db = getFirestore(this.app);

  myTickets: any[] = [];
  isModalOpen = false;
  reservaActual: any;

  currentUserEmail = this.auth.currentUser?.email;

  constructor(
    private firestoreService: FirestoreService,
  ) { }


  ngOnInit() {
    this.getAllMyBookings();
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

  transaleType(type: string) {
    if (type === 'theatre-booking') {
      return 'Entradas de teatro';
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
