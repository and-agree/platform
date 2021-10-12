import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AnonymousGuard, AuthenticatedGuard } from './core/guards';
import { AuthenticationResolve } from './core/resolves';
import { ApplicationComponent, WebsiteComponent } from './modules/layouts';

const routerConfig: ExtraOptions = {
    enableTracing: false,
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
};

const routes: Routes = [
    {
        path: '',
        component: WebsiteComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./modules/landing/landing.module').then((m) => m.LandingModule),
            },
        ],
    },
    {
        path: '',
        component: ApplicationComponent,
        resolve: { loggedIn: AuthenticationResolve },
        children: [
            {
                path: 'auth',
                loadChildren: () => import('./modules/authentication/authentication.module').then((m) => m.AuthenticationModule),
                canActivate: [AnonymousGuard],
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
                canActivate: [AuthenticatedGuard],
            },
            {
                path: 'decision',
                loadChildren: () => import('./modules/decision/decision.module').then((m) => m.DecisionModule),
                canActivate: [AuthenticatedGuard],
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerConfig)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
