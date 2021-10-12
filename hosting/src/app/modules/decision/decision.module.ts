import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { DecisionCreateComponent } from './create/decision-create.component';
import { DecisionRoutingModule } from './decision-routing.module';
import { DecisionComponent } from './decision.component';
import { DecisionFinaliseComponent } from './finalise/decision-finalise.component';
import { DecisionFinaliseDialogComponent } from './finalise/finalise-dialog/decision-finalise-dialog.component';
import { DecisionViewComponent } from './view/decision-view.component';
import { DecisionDeleteDialogComponent } from './view/delete-dialog/decision-delete-dialog.component';
import { DecisionReminderDialogComponent } from './view/reminder-dialog/decision-reminder-dialog.component';

@NgModule({
    declarations: [
        DecisionComponent,
        DecisionCreateComponent,
        DecisionDeleteDialogComponent,
        DecisionFinaliseComponent,
        DecisionFinaliseDialogComponent,
        DecisionReminderDialogComponent,
        DecisionViewComponent,
    ],
    imports: [DecisionRoutingModule, SharedModule],
})
export class DecisionModule {}
