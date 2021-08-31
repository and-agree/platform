import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services';

@Directive({
    selector: '[agreeAuthenticated]',
})
export class AuthenticatedDirective implements OnInit {
    @Input()
    public agreeAuthenticated: boolean;

    constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef, private authenticationService: AuthenticationService) {}

    public ngOnInit(): void {
        this.authenticationService.user.subscribe((user) => {
            if (this.agreeAuthenticated === !!user) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainerRef.clear();
            }
        });
    }
}
