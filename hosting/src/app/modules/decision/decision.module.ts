import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { DecisionCreateComponent } from './create/decision-create.component';
import { DecisionRoutingModule } from './decision-routing.module';
import { DecisionComponent } from './decision.component';
import { DecisionFinaliseComponent } from './finalise/decision-finalise.component';
import { DecisionFinaliseDialogComponent } from './finalise/dialog/decision-finalise-dialog.component';
import { DecisionViewComponent } from './view/decision-view.component';
import { DecisionReminderDialogComponent } from './view/dialog/decision-reminder-dialog.component';

@NgModule({
    declarations: [
        DecisionComponent,
        DecisionCreateComponent,
        DecisionReminderDialogComponent,
        DecisionFinaliseComponent,
        DecisionFinaliseDialogComponent,
        DecisionViewComponent,
    ],
    imports: [DecisionRoutingModule, SharedModule],
})
export class DecisionModule {}
