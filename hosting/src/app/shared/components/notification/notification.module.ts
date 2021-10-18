import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NotificationComponent } from './notification.component';

@NgModule({
    declarations: [NotificationComponent],
    imports: [CommonModule, MatFormFieldModule],
    exports: [NotificationComponent],
})
export class NotificationModule {}
