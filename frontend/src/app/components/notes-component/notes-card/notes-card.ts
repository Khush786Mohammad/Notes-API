import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notes } from '../../../model/notes';

@Component({
  standalone: true,
  selector: 'notes-card',
  templateUrl: './notes-card.html',
  styleUrl: './notes-card.css',
  imports: [DatePipe],
})
export class NotesCard {
  @Input({ required: true }) note!: Notes;
  @Output() selected = new EventEmitter<Notes>();
  @Output() deleted = new EventEmitter<number>();

  selectNote(): void {
    this.selected.emit(this.note);
  }

  deleteNote(event: Event): void {
    event.stopPropagation();
    this.deleted.emit(this.note.id);
  }
}
