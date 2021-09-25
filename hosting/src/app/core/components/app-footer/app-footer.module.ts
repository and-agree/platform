import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared';
import { AppFooterComponent } from './app-footer.component';

@NgModule({
    declarations: [AppFooterComponent],
    imports: [SharedModule, RouterModule],
    exports: [AppFooterComponent],
})
export class AppFooterModule {}
