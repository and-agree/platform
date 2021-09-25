import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { DecisionCreateComponent } from './create/decision-create.component';
import { DecisionRoutingModule } from './decision-routing.module';
import { DecisionComponent } from './decision.component';
import { DecisionFinaliseComponent } from './finalise/decision-finalise.component';
import { DecisionViewComponent } from './view/decision-view.component';

@NgModule({
    declarations: [DecisionComponent, DecisionCreateComponent, DecisionFinaliseComponent, DecisionViewComponent],
    imports: [DecisionRoutingModule, SharedModule],
})
export class DecisionModule {}
