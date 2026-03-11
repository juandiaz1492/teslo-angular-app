import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, firstValueFrom, map, Observable, of, tap } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {

    //para el localStorage
    private platformId = inject(PLATFORM_ID);
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
        return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
            email: email,
            password: password,
        }).pipe(
            map((resp) => this.handleLoginSuccess(resp)),
            catchError((error: any) => this.handleLoginError(error))
        )
    }

    register(email: string, password: string, username: string): Observable<boolean> {

        console.log('CREANDO USUARIO:', {
            email,
            password,
            username
        });

        return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
            email: email,
            password: password,
            fullName: username
        }).pipe(
            map(() => true),
            catchError(() => of(false))
        )
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

        return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // }
        }).pipe(
            map((resp) => this.handleLoginSuccess(resp))
        )
    }




    logout() {
        this._user.set(null);
        this._authStatus.set('not-authenticated');
        this._token.set(null);
        localStorage.removeItem('token');
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
        return of(false);
    }
}