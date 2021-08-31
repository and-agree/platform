import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AnonymousGuard, AuthenticatedGuard } from './core/guards';
import { AuthenticationResolve } from './core/resolves';
import { LayoutComponent } from './layout.component';

const routerConfig: ExtraOptions = {
    enableTracing: false,
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
};

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        resolve: { loggedIn: AuthenticationResolve },
        children: [
            {
                path: '',
                loadChildren: () => import('./modules/authentication/authentication.module').then((m) => m.AuthenticationModule),
                canActivate: [AnonymousGuard],
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
                canActivate: [AuthenticatedGuard],
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'decision',
                loadChildren: () => import('./modules/decision/decision.module').then((m) => m.DecisionModule),
                canActivate: [AuthenticatedGuard],
                runGuardsAndResolvers: 'always',
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
