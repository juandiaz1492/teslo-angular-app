import { AuthService } from './../services/auth.service';
import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export const AuthenticatedGuard: CanMatchFn = async () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    // if(authService.authStatus() == 'authenticated'){
    //     return true; 
    // }

    // router.navigateByUrl('/auth/login'); 
    // return false;

    const isAuthenticated = await firstValueFrom(authService.checkStatus());

    if (isAuthenticated) {
        return true;
    }

    router.navigateByUrl('/auth/login');
    return false;


}