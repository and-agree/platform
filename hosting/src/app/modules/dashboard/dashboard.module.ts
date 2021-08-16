import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DecisionsComponent } from './decisions/decisions.component';

@NgModule({
    declarations: [DashboardComponent, DecisionsComponent],
    imports: [DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
