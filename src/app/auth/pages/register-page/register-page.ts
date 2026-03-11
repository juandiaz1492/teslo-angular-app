import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
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
    password: ['', [Validators.required, Validators.minLength(6)]],
    username: ['', [Validators.required, Validators.minLength(1)]]
  })


  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000)
      return;
    }

    const { email = '', password = '', username= ''} = this.registerForm.value;

    this.authService.register(email!, password!, username!).subscribe((isValid) => {
      if (isValid) {
        this.router.navigateByUrl('/auth/login');
        return;
      }

      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000)
    })

  }
  
}
