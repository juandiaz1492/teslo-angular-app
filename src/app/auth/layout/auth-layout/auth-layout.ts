import { Component, inject, } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {  NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {

  router = inject(Router);

  currentRoute = toSignal(
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.router.url)
  ),
  { initialValue: this.router.url }
);



}
