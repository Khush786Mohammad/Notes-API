import { AsyncPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, take, timer } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  imports: [RouterLink, FormsModule, AsyncPipe],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register implements OnInit {
  isLoading = signal<boolean>(false);
  regsitering = signal<boolean>(true);
  countDown$!: any;
  constructor(
    private titleService: Title,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.titleService?.setTitle('Notes API | Register');
  }
  authForm = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  };
  showPassword = false;
  showConfirmPassword = false;

  onSubmit(form: NgForm) {
    if (form?.invalid) {
      return;
    }
    const payload = {
      username: form?.value?.username,
      password: form?.value?.password,
      email: form?.value?.email,
    };
    this.isLoading.set(true);
    this.authService?.register(payload)?.subscribe({
      next: (data) => {
        if (data && data?.id) {
          this.regsitering.set(false);
          const startValue = 5;
          this.countDown$ = timer(0, 1000).pipe(
            take(startValue + 1),
            map((tick) => startValue - tick),
            finalize(() => {
              this.router.navigate(['/auth/login'], {
                replaceUrl: true,
              });
            }),
          );
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error(err?.error?.error ?? 'Registration Failed');
        console.log(err);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
