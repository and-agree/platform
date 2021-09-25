import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecisionRetrieveResolve } from './../../core/resolves/decision-retrieve.resolve';
import { DecisionCreateComponent } from './create/decision-create.component';
import { DecisionComponent } from './decision.component';
import { DecisionFinaliseComponent } from './finalise/decision-finalise.component';
import { DecisionViewComponent } from './view/decision-view.component';

const routes: Routes = [
    {
        path: '',
        component: DecisionComponent,
        children: [
            {
                path: 'create',
                component: DecisionCreateComponent,
            },
            {
                path: 'view/:decisionId',
                component: DecisionViewComponent,
                resolve: { decision: DecisionRetrieveResolve },
            },
            {
                path: 'finalise/:decisionId',
                component: DecisionFinaliseComponent,
                resolve: { decision: DecisionRetrieveResolve },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DecisionRoutingModule {}
