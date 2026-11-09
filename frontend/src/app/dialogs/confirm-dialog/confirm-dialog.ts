import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.css',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  event = input<'delete' | 'logout'>('delete');
  noteTitle = input('this note');
  confirmedDelete = output<void>();
  confirmedLogout = output<void>();
  dismissed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.dismissed.emit();
  }
}
