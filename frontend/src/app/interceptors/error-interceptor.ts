import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        toastr.error('You are unauthorized to use this service.');
        authService.logout();
        router.navigate(['/auth/login'], {
          replaceUrl: true,
        });
      } else if (err.status >= 500) {
        toastr.error('Server error, please try again.');
      }
      return throwError(() => err);
    }),
  );
};
