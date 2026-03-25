import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { VerifyPage } from './pages/verify-page/verify-page';

export const authRoutes: Routes = [
    {
        path: '', 
        component: AuthLayout, 
        children: [
            {
                path: 'login',
                component: LoginPage,
            }, 
            {
                path: 'register', 
                component: RegisterPage, 
            }, 
            {
                path: 'verify', 
                component: VerifyPage,
            },
            {
                path: '**', 
                redirectTo: 'login'
            }

        ]
    }
      
]; 

export default authRoutes; 