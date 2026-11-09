import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequest: number = 0;

  readonly isLoading = signal<boolean>(false);

  show(): void {
    this.activeRequest++;
    this.isLoading.set(true);
  }

  hide(): void {
    this.activeRequest = Math.max(0, this.activeRequest - 1);
    this.isLoading.set(this.activeRequest > 0);
  }
}
