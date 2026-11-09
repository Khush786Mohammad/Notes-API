import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlay } from './components/loading-overlay/loading-overlay';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  imports: [RouterOutlet, LoadingOverlay],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('notes-api');
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.authService.onApplicationStartup();
    if (this.authService?.isAuthenticated()) {
      this.authService?.loadUserDetails()?.subscribe({
        error: () => {
          this.toastr.error('Failed to fetch user details');
        },
      });
    }
  }
}
