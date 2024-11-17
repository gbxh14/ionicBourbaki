import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonDatetimeButton, IonDatetime, IonModal, IonButtons, IonButton, IonInput, IonNote, IonIcon, IonCardHeader, IonCardContent, IonCard, IonCardTitle, IonCardSubtitle, IonBadge } from '@ionic/angular/standalone';
import { FirestoreService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';
import { Evento } from '../models/event.model';
import { addIcons } from 'ionicons';
import { help, helpCircleOutline, locationOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-schedule',
  templateUrl: 'schedule.page.html',
  styleUrls: ['schedule.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardHeader, IonIcon, IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    CommonModule,
    IonDatetimeButton,
    IonDatetime,
    IonButtons,
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonBadge
  ],
})
export class SchedulePage {

  title = 'Horario';
  allEvents: Evento[] = [];
  displayedEvents: Evento[] = [];
  isModalOpen = false;
  selectedEvent: Evento | null = null;
  formatedDate = '';

  constructor(
    private firestoreService: FirestoreService
  ) {
    addIcons( {timeOutline, locationOutline, helpCircleOutline} );
    this.getAllEvents(); // recuperamos todos los eventos de la BBDD
    this.getEventsByDay(new Date().toISOString()); // mostramos los eventos para hoy
  }

  getAllEvents() {
    this.firestoreService.getCollectionChanges<Evento[]>('Event').subscribe(result => {
      this.allEvents = result as Evento[];
    })
  }

  getEventsByDay(day: string) {
    day = day.split('T')[0];
    this.displayedEvents = this.allEvents.filter(event => event.day === day).sort((a, b) => {
      return a.time.localeCompare(b.time);  // ordenamos por hora
    });
  }

  setOpen(isOpen: boolean, evento: Evento) {
    this.isModalOpen = isOpen;
    this.selectedEvent = evento;
  }

  formatDate(date: string){
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  goToMap(location?: string) {
    window.open(location, '_blank');
  }
}
