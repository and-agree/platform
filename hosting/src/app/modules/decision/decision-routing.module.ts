import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecisionCreateComponent } from './create/decision-create.component';
import { DecisionComponent } from './decision.component';

const routes: Routes = [
    {
        path: '',
        component: DecisionComponent,
        children: [
            {
                path: 'create',
                component: DecisionCreateComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DecisionRoutingModule {}
