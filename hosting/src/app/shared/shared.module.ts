import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthenticatedDirective } from './directives/authenticated.directive';
import { FilterPipe } from './pipes/filter.pipe';
import { TimestampPipe } from './pipes/timestamp.pipe';

@NgModule({
    declarations: [AuthenticatedDirective, FilterPipe, TimestampPipe],
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatStepperModule,
        MatToolbarModule,
        AuthenticatedDirective,
        FilterPipe,
        TimestampPipe,
    ],
    providers: [DatePipe, FilterPipe, TimestampPipe],
})
export class SharedModule {}
