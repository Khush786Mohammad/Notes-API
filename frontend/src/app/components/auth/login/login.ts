import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { LoginForm } from '../../../model/loginForm';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, tap, throwError, catchError } from 'rxjs';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login implements OnInit {
  authForm: LoginForm = {
    username: '',
    password: '',
  };
  showPassword: boolean = false;

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Notes API | Login');
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const data = {
      username: form.value?.username,
      password: form.value?.password,
    };
    this.authService
      ?.login(data)
      ?.pipe(
        tap((res) => {
          localStorage.setItem('token', (res as any).token);
          this.authService?.initiateSessionTimeout();
        }),
        switchMap(() => this.authService?.loadUserDetails()),
        catchError((err) => {
          this.authService?.logout();
          return throwError(() => err);
        }),
      )
      ?.subscribe({
        next: (user) => {
          this.router.navigate(['/user/notes'], { replaceUrl: true });
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error('Login failed or unable to load user profile.');
        },
      });
  }
}
