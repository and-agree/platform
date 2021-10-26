import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';
import { ForgottenComponent } from './forgotten/forgotten.component';
import { LoginComponent } from './login/login.component';
import { RecoverComponent } from './recover/recover.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    {
        path: '',
        component: AuthenticationComponent,
        children: [
            {
                path: '',
                component: LoginComponent,
                data: { title: 'Login' },
            },
            {
                path: 'register',
                component: RegisterComponent,
                data: { title: 'Register' },
            },
            {
                path: 'forgotten',
                component: ForgottenComponent,
                data: { title: 'Password forgotten' },
            },
            {
                path: 'recover',
                component: RecoverComponent,
                data: { title: 'Password reset' },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
