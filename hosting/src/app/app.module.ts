import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
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
        AngularFirestoreModule,
        AngularFirestoreModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AppBarModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
