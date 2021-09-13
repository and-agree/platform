import { NgModule } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import {
    connectFirestoreEmulator,
    enableMultiTabIndexedDbPersistence,
    getFirestore,
    provideFirestore,
} from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppBarModule } from './core/components';
import { LayoutComponent } from './layout.component';

@NgModule({
    declarations: [AppComponent, LayoutComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AppBarModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => {
            const auth = initializeAuth(getApp(), { persistence: indexedDBLocalPersistence });
            if (environment.emulator) {
                connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            }
            return auth;
        }),
        provideFirestore(() => {
            const firestore = getFirestore();
            if (environment.emulator) {
                connectFirestoreEmulator(firestore, 'localhost', 8080);
            }
            enableMultiTabIndexedDbPersistence(firestore).then(() => true, () => false);;
            return firestore;
        }),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
