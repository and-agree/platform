import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { ForgottenComponent } from './forgotten/forgotten.component';
import { LoginComponent } from './login/login.component';
import { RecoverComponent } from './recover/recover.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [AuthenticationComponent, ForgottenComponent, LoginComponent, RecoverComponent, RegisterComponent],
    imports: [AuthenticationRoutingModule, SharedModule],
})
export class AuthenticationModule {}
