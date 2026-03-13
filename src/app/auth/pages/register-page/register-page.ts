import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { NgxSonnerToaster } from 'ngx-sonner';


@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule, NgxSonnerToaster],
  templateUrl: './register-page.html',
})
export class RegisterPage {

  fb = inject(FormBuilder)
  authService = inject(AuthService);
  router = inject(Router);

  hasError = signal(false);
  isPosting = signal(false);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]
    ],
    username: ['', [Validators.required, Validators.minLength(1)]]
  })


  get passwordControl() {
    return this.registerForm.get('password');
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000)
      return;
    }

    const { email = '', password = '', username = '' } = this.registerForm.value;

    this.authService.register(email!, password!, username!).subscribe({
      next: () => {
        toast.success('Cuenta creada correcatemente');
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        const message = err?.error?.message;

        //por si hay vario
        if (Array.isArray(message)) {
          message.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error(message);
        }
      }
    })

  }

}
