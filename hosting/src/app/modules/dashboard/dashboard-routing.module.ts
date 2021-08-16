import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecisionListResolve } from '../../core/resolves';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        resolve: {
            decisionData: DecisionListResolve,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
