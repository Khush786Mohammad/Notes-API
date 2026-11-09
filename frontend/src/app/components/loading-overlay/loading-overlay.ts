import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  standalone: true,
  selector: 'loading-overlay',
  styleUrl: './loading-overlay.css',
  templateUrl: './loading-overlay.html',
  imports: [],
})
export class LoadingOverlay {
  constructor(private loadingService: LoadingService) {}
}
