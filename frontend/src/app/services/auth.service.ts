import { HttpClient } from '@angular/common/http';
import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly tokenKey = 'token';
  private readonly expireKey = 'expireIn';
  baseUrl: string = '';
  contextPath: string = '';
  sessionTimeout!: number;
  intervalId?: ReturnType<typeof setInterval>;
  private remainingSeconds = signal<number>(0);
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  readonly remainingTime = computed(() => {
    const totalSeconds = this.remainingSeconds();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  });

  readonly remainingTimeStatus = computed(() => {
    const totalSeconds = this.remainingSeconds();
    if (totalSeconds < 60) {
      return 'critical';
    }
    if (totalSeconds < 5 * 60) {
      return 'warning';
    }
    return 'safe';
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.baseUrl = env.baseUrl;
    this.contextPath = env.contextPath;
    this.sessionTimeout = env.expireDuration;

    // window.addEventListener('storage', (event) => {
    //   if (event.key === this.tokenKey || event.key === this.expireKey) {
    //     this.logout();
    //   }
    // });
  }

  loadUserDetails(): Observable<User | null> {
    return this.fetchUserDetails()?.pipe(
      tap((user) => this.userSubject.next(user)),
    );
  }

  fetchUserDetails(): Observable<User> {
    return this.http.post<User>(
      `${this.baseUrl + this.contextPath}/profile/me`,
      null,
    );
  }

  onApplicationStartup(): void {
    if (this.isAuthenticated()) {
      this.restoreSessionTimer();
      this.router.navigate(['/user/notes'], {
        replaceUrl: true,
      });
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  register(data: any): Observable<User> {
    return this.http.post<User>(
      `${this.baseUrl + this.contextPath}/auth/register`,
      data,
    );
  }

  login(data: any): Observable<Object> {
    return this.http.post(
      `${this.baseUrl + this.contextPath}/auth/login`,
      data,
    );
  }

  logout(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expireKey);

    this.userSubject.next(null);

    this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  initiateSessionTimeout(): void {
    // store the session expiry time in milliseconds.
    const expiryTime = Date.now() + this.sessionTimeout * 60 * 1000;
    localStorage.setItem(this.expireKey, String(expiryTime));

    this.startSessionTimer();
  }

  startSessionTimer(): void {
    //clearing previous interval before creating another one.
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    const updateTimer = () => {
      const expiryTime = Number(localStorage.getItem(this.expireKey));
      // check the expiry timestamp every second
      if (!expiryTime || Date.now() >= expiryTime) {
        this.remainingSeconds.set(0);
        this.logout();
        return;
      }
      const remaining = Math.ceil((expiryTime - Date.now()) / 1000);
      this.remainingSeconds.set(remaining);
    };
    updateTimer();
    this.intervalId = setInterval(updateTimer, 1000);
  }

  restoreSessionTimer(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return;
    }
    // restoring the existing expiry time;
    const expiryTime = Number(localStorage.getItem(this.expireKey));
    if (!expiryTime || Date.now() >= expiryTime) {
      this.logout();
      return;
    }
    this.startSessionTimer();
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
