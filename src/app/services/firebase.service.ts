import { inject, Injectable } from '@angular/core';
import { collectionData, collection, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

}
