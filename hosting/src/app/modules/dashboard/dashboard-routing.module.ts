import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecisionArchivedResolve, DecisionPendingResolve } from '../../core/resolves';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        resolve: {
            pendingData: DecisionPendingResolve,
            archivedData: DecisionArchivedResolve,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
