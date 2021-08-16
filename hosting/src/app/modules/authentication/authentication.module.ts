import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [AuthenticationComponent, LoginComponent],
    imports: [AuthenticationRoutingModule, SharedModule],
})
export class AuthenticationModule {}
