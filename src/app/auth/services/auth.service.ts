import { Route, Router } from '@angular/router';
import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, firstValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toast } from 'ngx-sonner';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'

const baseUrl = environment.baseUrl;
const baseUrlAuth = environment.baseUrlAuth;

@Injectable({ providedIn: 'root' })
export class AuthService {
    private platformId = inject(PLATFORM_ID);
    private router = inject(Router);
    private isBrowser = isPlatformBrowser(this.platformId);

    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(
        this.isBrowser ? localStorage.getItem('token') : null);

    private http = inject(HttpClient);

    checkStatusResource = resource({
        loader: () => firstValueFrom(this.checkStatus())
    });


    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() == 'checking') return 'checking';

        if (this._user()) {
            return 'authenticated'
        }
        return 'not-authenticated'
    });

    user = computed<User | null>(() => this._user());

    token = computed(() => this._token());

    isAdmin = computed(() =>
        this.user()?.roles.includes('admin') ?? false);

    login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseUrlAuth}/user/login`, {
            mail: email,
            password: password,
        }).pipe(
            map((resp) => this.handleLoginSuccess(resp)),
            catchError((error: any) => this.handleLoginError(error))
        );
    }

    register(email: string, password: string, username: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseUrlAuth}/user/register`, {
            mail: email,
            password: password,
            username: username
        }).pipe(
            map(() => true),
            catchError((error: any) => {
            const message = error?.error?.message || error?.error || 'Error al registrar usuario';
            toast.error(message);
            return of(false);
        })    
        );
    }

    verifyToken(token: string): Observable<boolean> {
        return this.http.get(`${baseUrlAuth}/user/verify`, {
            params: { token }
        }).pipe(
            map(() => true),
            catchError((error: any) => {
                const message = error?.error?.message || error?.error || 'Error verificando la cuenta';
                toast.error(message);
                return of(false);
            })
        );
    }

    checkStatus(): Observable<boolean> {

        if (!this.isBrowser) {
            return of(false);
        }

        const token = localStorage.getItem('token');

        if (!token) {
            this.logout();
            return of(false);
        }

        return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
            map((resp) => this.handleLoginSuccess(resp)),
            catchError(() => {
                this._user.set(null);
                this._authStatus.set('not-authenticated');
                this._token.set(null);
                localStorage.removeItem('token');
                //this.router.navigateByUrl('/auth/login');
                return of(false);
            })
        );
    }


    logout() {
        this._user.set(null);
        this._authStatus.set('not-authenticated');
        this._token.set(null);
        if (this.isBrowser) {
            localStorage.removeItem('token');
        }

        //this.router.navigateByUrl('/auth/login');

    }


    private handleLoginSuccess({ token, user }: AuthResponse) {
        this._user.set(user);
        this._authStatus.set('authenticated');
        this._token.set(token);

        if (this.isBrowser) {
            localStorage.setItem('token', token);
        }

        return true;
    }

    private handleLoginError(error: any) {
        this.logout();

        const message = error?.error?.message || error?.error;
        if (message) {
            toast.error(message);
        }

        return of(false);
    }
}