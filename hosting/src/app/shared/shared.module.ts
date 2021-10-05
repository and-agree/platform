import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorMessageModule } from './components/error-message/error-message.module';
import { AuthenticatedDirective } from './directives/authenticated.directive';
import { CountPipe } from './pipes';
import { FilterPipe } from './pipes/filter.pipe';
import { TimestampPipe } from './pipes/timestamp.pipe';

@NgModule({
    declarations: [AuthenticatedDirective, CountPipe, FilterPipe, TimestampPipe],
    imports: [CommonModule, ReactiveFormsModule, ErrorMessageModule],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSelectModule,
        MatStepperModule,
        MatToolbarModule,
        AuthenticatedDirective,
        CountPipe,
        FilterPipe,
        TimestampPipe,
        ErrorMessageModule,
    ],
    providers: [CountPipe, DatePipe, FilterPipe, TimestampPipe],
})
export class SharedModule {}
