import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorMessageComponent } from './error-message.component';

@NgModule({
    declarations: [ErrorMessageComponent],
    imports: [CommonModule, MatFormFieldModule],
    exports: [ErrorMessageComponent],
})
export class ErrorMessageModule {}
