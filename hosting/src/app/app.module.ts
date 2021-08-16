import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppBarModule } from './core/components';
import { LayoutComponent } from './layout.component';

@NgModule({
    declarations: [AppComponent, LayoutComponent],
    imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, AppBarModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
