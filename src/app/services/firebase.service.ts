import { inject, Injectable } from '@angular/core';
import { collectionData, collection, Firestore, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AvailableBooking } from '../models/availableBooking.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore);

  constructor() { }

  getCollectionChanges<T>(collect: string) {
    const refCollection = collection(this.firestore, collect);
    return collectionData(refCollection) as Observable<T>;
  }

  // 
  getBooking(booking: string) {
    const reservas = collection(this.firestore, 'AvailableBookings');
    console.log('Reservas', reservas);
    return getDocs(reservas).then(snapshot => {
      let bookingDetails = null;
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        if (doc.data()['url'] === booking) {
          bookingDetails = doc.data();
        }
      });
      return bookingDetails;
    }).catch(err => {
      console.error('Error al obtener las reservas', err);
      return null;
    });
  }

  getBookingId(booking: string) {
  }

}
