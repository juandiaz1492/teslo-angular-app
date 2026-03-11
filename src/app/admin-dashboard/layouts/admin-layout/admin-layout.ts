import { AuthService } from './../../../auth/services/auth.service';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
})
export class AdminLayout { 

  authService = inject(AuthService); 

  user = computed(() => this.authService.user());


}
