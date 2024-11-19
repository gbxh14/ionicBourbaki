import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonCard, IonList, IonCardContent, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { FirestoreService } from '../services/firebase.service';
import { AvailableBooking } from '../models/availableBooking.model';
import { addIcons } from 'ionicons';
import { fastFoodOutline, medalOutline, shirtOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: 'bookings.page.html',
  styleUrls: ['bookings.page.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonCardContent, IonList, IonCard, IonItem, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class BookingsPage implements OnInit {
  title = 'Reservas';
  posiblesReservas: AvailableBooking[] = [];
  constructor(
    private firestoreService: FirestoreService,
    private route: Router,
  ) {
    addIcons({ fastFoodOutline, medalOutline, shirtOutline });
  }

  ngOnInit() {
    this.getAllAvailableBookings();
  }

  getAllAvailableBookings() {
    this.firestoreService.getCollectionChanges<AvailableBooking[]>('AvailableBookings').subscribe(result => {
      this.posiblesReservas = result as AvailableBooking[];
    })
  }

  goToBookingOption(reserva: AvailableBooking) {
    console.log('Navegando a', reserva.url);
    this.route.navigate([reserva.url]);
    // this.route.navigate(['./tabs/bookings/' + reserva.url]);

  }
}
