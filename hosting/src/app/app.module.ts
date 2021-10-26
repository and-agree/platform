import { NgModule } from '@angular/core';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, enableMultiTabIndexedDbPersistence, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectFunctionsEmulator, FunctionsModule, getFunctions, provideFunctions } from '@angular/fire/functions';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppBarModule, AppFooterModule } from './core/components';
import { ApplicationComponent, WebsiteComponent } from './modules/layouts';

@NgModule({
    declarations: [AppComponent, ApplicationComponent, WebsiteComponent],
    imports: [
        BrowserModule,
        FunctionsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AppBarModule,
        AppFooterModule,
        MatNativeDateModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
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
            enableMultiTabIndexedDbPersistence(firestore).then(
                () => true,
                () => false
            );
            return firestore;
        }),
        provideStorage(() => {
            const storage = getStorage();
            if (environment.emulator) {
                connectStorageEmulator(storage, 'localhost', 9199);
            }
            return storage;
        }),
        provideFunctions(() => {
            const functions = getFunctions(undefined, 'europe-west2');
            if (environment.emulator) {
                connectFunctionsEmulator(functions, 'localhost', 5001);
            }
            return functions;
        }),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
