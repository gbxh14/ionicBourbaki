import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-theatre-booking',
  templateUrl: './theatre-booking.page.html',
  styleUrls: ['./theatre-booking.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TheatreBookingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
