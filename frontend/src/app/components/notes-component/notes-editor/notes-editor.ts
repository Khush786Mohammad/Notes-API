import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'notes-editor',
  templateUrl: './notes-editor.html',
  styleUrl: './notes-editor.css',
  imports: [FormsModule],
})
export class NotesEditor {
  @Input() header = '';
  @Input() mode: 'new' | 'update' = 'new';
  @Input() set initialNote(note: {
    id?: number;
    title: string;
    content: string;
  }) {
    this.note = { ...note };
  }
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{
    id?: number;
    title: string;
    content: string;
  }>();

  note: { id?: number; title: string; content: string } = {
    title: '',
    content: '',
  };

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.saved.emit({ ...this.note });
    }
  }
}
