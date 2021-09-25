import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { DashboardArchivedComponent } from './archived/dashboard-archived.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardPendingComponent } from './pending/dashboard-pending.component';

@NgModule({
    declarations: [DashboardArchivedComponent, DashboardComponent, DashboardPendingComponent],
    imports: [DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
