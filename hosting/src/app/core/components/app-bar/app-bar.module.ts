import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared';
import { AppBarComponent } from './app-bar.component';

@NgModule({
    declarations: [AppBarComponent],
    imports: [SharedModule, RouterModule],
    exports: [AppBarComponent],
})
export class AppBarModule {}
