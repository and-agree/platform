import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { HomeComponent } from './home/home.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';

@NgModule({
    declarations: [LandingComponent, HomeComponent],
    imports: [LandingRoutingModule, SharedModule],
})
export class LandingModule {}
