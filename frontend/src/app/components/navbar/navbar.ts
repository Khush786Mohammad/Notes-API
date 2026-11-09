import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ConfirmDialog } from '../../dialogs/confirm-dialog/confirm-dialog';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  imports: [ConfirmDialog, AsyncPipe, FormsModule],
})
export class Navbar {
  currentTheme: 'light' | 'dark' = 'light';
  pendingLogout = signal<boolean>(false);
  searchKey: string = '';
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  constructor(public authService: AuthService) {}

  setTheme(theme: 'light' | 'dark'): void {
    //documentElement is a reference to the root HTML element. It represents the <html> tag.
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
    this.currentTheme = theme;
  }

  requestLogout(): void {
    this.pendingLogout.set(true);
  }

  confirmLogout(): void {
    this.pendingLogout.set(false);
    this.authService.logout();
  }

  onValueChanges(): void {
    this.search.emit(this.searchKey);
  }
}
