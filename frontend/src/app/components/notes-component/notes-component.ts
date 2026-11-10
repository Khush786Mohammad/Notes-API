import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ConfirmDialog } from '../../dialogs/confirm-dialog/confirm-dialog';
import { Notes } from '../../model/notes';
import { NotesService } from '../../services/notes.service';
import { Navbar } from '../navbar/navbar';
import { Pagination } from '../pagination/pagination';
import { NotesCard } from './notes-card/notes-card';
import { NotesEditor } from './notes-editor/notes-editor';

type NotesSortOption = 'crtDt-asc' | 'crtDt-desc' | 'title-asc' | 'title-desc';

@Component({
  selector: 'app-notes-component',
  styleUrl: './notes-component.css',
  templateUrl: './notes-component.html',
  imports: [
    Navbar,
    Pagination,
    CommonModule,
    NotesCard,
    NotesEditor,
    ConfirmDialog,
  ],
})
export class NotesComponent implements OnInit {
  private searchSubject = new Subject();
  private destroyRef = inject(DestroyRef);

  notesData = signal<Notes[]>([]);
  sortOption = signal<NotesSortOption>('crtDt-asc');
  isEditorOpen = signal(false);
  pendingDelete = signal<Notes | null>(null);
  editorHeader = '';
  editorMode: 'new' | 'update' = 'new';
  searchKey: string = '';

  currentPage: number = 0;
  totalPages: number = 1;
  pageSize: number = 8;

  note: { id?: number; title: string; content: string } = {
    title: '',
    content: '',
  };

  constructor(
    private notesService: NotesService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.fetchNotesData(0, 8);
    this.searchSubject
      ?.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchKey: any) =>
          this.notesService.searchNoteData(
            0,
            this.pageSize,
            undefined,
            undefined,
            searchKey,
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      ?.subscribe({
        next: (res: any) => {
          this.updateNotesData(res);
        },
        error: () => {
          this.toastr.error('Failed to search the note');
        },
      });
  }

  fetchNotesData(pageNo: number = 0, size: number = this.pageSize) {
    const [sortField, order] = this.sortOption().split('-') as [
      'crtDt' | 'title',
      'asc' | 'desc',
    ];

    this.notesService.fetchAllNotes(pageNo, size, sortField, order).subscribe({
      next: (response: any) => {
        this.updateNotesData(response);
      },
      error: () => {
        this.toastr.error('Failed to fetch notes.');
      },
    });
  }

  searchNotes(searchKey: string) {
    this.searchKey = searchKey.trim();
    this.currentPage = 0;
    this.searchSubject.next(this.searchKey);
  }

  saveNote(note: { id?: number; title: string; content: string }): void {
    const noteId = note.id;
    const isUpdate = noteId !== undefined;
    const request =
      noteId !== undefined
        ? this.notesService.updateNoteById({
            id: note.id,
            title: note.title,
            content: note.content,
          })
        : this.notesService.addNewNote({
            title: note.title,
            content: note.content,
          });

    request.subscribe({
      next: () => {
        this.toastr.success(
          isUpdate ? 'Note updated successfully' : 'Note added successfully',
        );
        this.onCloseEditor();
        this.fetchNotesData(this.currentPage, this.pageSize);
      },
      error: (err: any) => {
        this.toastr.error(
          err?.error?.error ||
            (isUpdate ? 'Failed to update note' : 'Failed to add note'),
        );
      },
    });
  }

  deleteNote(id: number): void {
    this.notesService.deleteNoteById(id)?.subscribe({
      next: (response: any) => {
        this.toastr.success(response?.message);
        this.onCloseEditor();
        this.fetchNotesData(0, 8);
      },
      error: (err) => {
        this.toastr.error(err?.error || 'Failed to delete note');
      },
    });
  }

  requestDelete(id: number): void {
    const note = this.notesData().find((item) => item.id === id);
    if (note) {
      this.pendingDelete.set(note);
    }
  }

  confirmDelete(): void {
    const note = this.pendingDelete();
    this.pendingDelete.set(null);
    if (note) {
      this.deleteNote(note.id);
    }
  }

  onSelectedNote(note: Notes): void {
    this.editorHeader = 'Edit Note';
    this.editorMode = 'update';
    this.isEditorOpen.set(true);
    this.note = { id: note.id, title: note.title, content: note.content };
  }

  addNewNote() {
    this.editorHeader = 'New Note';
    this.note = { title: '', content: '' };
    this.isEditorOpen.set(true);
    this.editorMode = 'new';
  }

  onSortChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    const sortOption = target.value;
    if (
      sortOption === 'title-asc' ||
      sortOption === 'title-desc' ||
      sortOption === 'crtDt-desc' ||
      sortOption === 'crtDt-asc'
    ) {
      this.sortOption.set(sortOption);
      if (this.searchKey) {
        const [sortField, order] = this.sortOption().split('-') as [
          'crtDt' | 'title',
          'asc' | 'desc',
        ];
        this.notesService
          ?.searchNoteData(
            this.currentPage,
            this.pageSize,
            sortField,
            order,
            this.searchKey,
          )
          ?.subscribe({
            next: (res: any) => {
              this.updateNotesData(res);
            },
            error: () => {
              this.toastr.error('Failed to search notes');
            },
          });
      } else {
        this.fetchNotesData(0, this.pageSize);
      }
    }
  }

  onCloseEditor(): void {
    this.isEditorOpen.set(false);
  }

  onPageSizeChange(result: number) {
    if (this.searchKey) {
      this.notesService
        ?.searchNoteData(
          this.currentPage,
          result,
          undefined,
          undefined,
          this.searchKey,
        )
        ?.subscribe({
          next: (res: any) => {
            this.updateNotesData(res);
          },
          error: () => {
            this.toastr.error('Failed to search notes');
          },
        });
    } else {
      this.fetchNotesData(0, result);
    }
  }
  onPageToPage(data: any) {
    if (this.searchKey) {
      this.notesService
        ?.searchNoteData(
          data?.pageNo - 1,
          data?.pageSize,
          undefined,
          undefined,
          this.searchKey,
        )
        ?.subscribe({
          next: (res: any) => {
            this.updateNotesData(res);
          },
          error: () => {
            this.toastr.error('Failed to search notes');
          },
        });
    } else {
      this.fetchNotesData(data?.pageNo - 1, data?.pageSize);
    }
  }

  private updateNotesData(res: any): void {
    this.notesData.set(res.content);
    this.currentPage = res.pageable.pageNumber;
    this.pageSize = res.pageable.pageSize;
    this.totalPages = res.totalPages;
  }
}
