import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { TokenStorageService } from './token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  const token = tokenStorage.getToken();

  let authReq = req;
  if (token && !req.headers.has('Authorization')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Clear authentication state and redirect to /login
        tokenStorage.clear();
        notification.error('Session expired or unauthorized. Please log in again.');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        notification.error('Access denied. You do not have permission to perform this action.');
      }

      // Format clean error message
      const errorMessage =
        error.error?.message ||
        (typeof error.error === 'string' ? error.error : null) ||
        error.message ||
        'An unexpected server error occurred.';

      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        errors: error.error?.errors
      }));
    })
  );
};

