import { AuthService } from './../services/auth.service';
import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

export const AuthenticatedGuard: CanMatchFn = () => {

    const authService = inject(AuthService); 
    const router = inject(Router); 

    if(authService.authStatus() == 'authenticated'){
        return true; 
    }

    router.navigateByUrl('/auth/login'); 
    return false;
}