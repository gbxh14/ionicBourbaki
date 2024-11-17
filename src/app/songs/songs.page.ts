import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem, IonLabel, IonModal, IonButton, IonList, IonIcon, IonButtons, IonCardContent } from '@ionic/angular/standalone';
import { FirestoreService } from '../services/firebase.service';
import { Song } from '../models/song.model';

@Component({
  selector: 'app-songs',
  templateUrl: 'songs.page.html',
  styleUrls: ['songs.page.scss'],
  standalone: true,
  imports: [IonIcon, IonList, IonCardContent, IonButton, IonButtons, IonModal, IonLabel, IonItem, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class SongsPage {

  title = 'Canciones';
  allSongs: Song[] = [];
  isModalOpen = false;
  selectedSong: Song | null = null;
  lyrics: string[] = [];

  constructor(
    private firestoreService: FirestoreService
  ) {
    this.getAllSongs();
  }

  getAllSongs() {
    this.firestoreService.getCollectionChanges<Song[]>('Songs').subscribe(result => {
      this.allSongs = result as Song[];
      // Remove song called 'Rogativas' from the list
      this.allSongs = this.allSongs.filter(song => song.title !== 'Rogativas');
    })
  }

  setOpen(isOpen: boolean, cancion: Song) {
    if (!this.isModalOpen) {
      this.lyrics = [];
    }
    this.isModalOpen = isOpen;
    this.selectedSong = cancion;
    this.splitByDoubleSpaces(cancion.lyrics);
  }

  private splitByDoubleSpaces(text: string) {
    // Use a regular expression to split the text at every occurrence of two consecutive spaces
    let lines = text.split(/ {2}/);
    // Print each line
    lines.forEach(line => {
      this.lyrics.push(line);
    });
  }

}
