import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-verify-page',
  templateUrl: './verify-page.html',
  imports:[RouterLink]
})
export class VerifyPage implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  message = 'Verificando cuenta...';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('TOKEN:', token);

    if (!token) {
      this.message = 'Token no proporcionado';
      return;
    }

    this.authService.verifyToken(token).subscribe({
      next: (ok) => {
        console.log('RESPUESTA VERIFY:', ok);

        if (ok) {
          this.message = 'Cuenta verificada correctamente';
        } else {
          this.message = 'No se ha podido verificar correctamente';
        }

        setTimeout(() => {
          this.router.navigateByUrl('/auth/login');
        }, 2500);
      },
      error: (err) => {
        console.error('ERROR VERIFY:', err);
        this.message = 'Error al verificar la cuenta';
      }
    });
  }
}