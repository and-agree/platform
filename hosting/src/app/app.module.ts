import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, USE_EMULATOR as AUTH_EMULATOR } from '@angular/fire/auth';
import { AngularFirestoreModule, USE_EMULATOR as FIRESTORE_EMULATOR } from '@angular/fire/firestore';
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
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AppBarModule,
    ],
    providers: [
        { provide: AUTH_EMULATOR, useValue: environment.emulator ? ['localhost', 9099] : undefined },
        { provide: FIRESTORE_EMULATOR, useValue: environment.emulator ? ['localhost', 8080] : undefined },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
