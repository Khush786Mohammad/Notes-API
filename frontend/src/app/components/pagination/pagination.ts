import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  styleUrl: './pagination.css',
  templateUrl: './pagination.html',
  imports: [FormsModule],
})
export class Pagination {
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Output() pageSizeEmitter = new EventEmitter<number>();
  @Output() pageEmitter = new EventEmitter<any>();

  customPageNumber: number | null = null;
  pageSize: number = 8;

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    const obj = {
      pageNo: this.currentPage,
      pageSize: this.pageSize,
    };
    this.pageEmitter.emit(obj);
  }

  onSubmit(data: NgForm) {
    if (
      data.invalid ||
      this.customPageNumber === null ||
      this.customPageNumber === this.currentPage
    ) {
      return;
    }
    this.onPageChange(this.customPageNumber);
  }

  onCustomPageKeydown(event: KeyboardEvent): void {
    if (
      !/\d/.test(event.key) &&
      ![
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'Tab',
        'Home',
        'End',
      ].includes(event.key) &&
      !(event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
    }
  }

  onCustomPageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '');

    if (input.value !== digitsOnly) {
      input.value = digitsOnly;
    }

    this.customPageNumber = digitsOnly ? Number(digitsOnly) : null;
  }
  get paginationItems(): (number | 'ellipsis')[] {
    if (this.totalPages <= 7) {
      return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    }

    if (this.currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', this.totalPages];
    }

    if (this.currentPage >= this.totalPages - 3) {
      return [
        1,
        'ellipsis',
        this.totalPages - 4,
        this.totalPages - 3,
        this.totalPages - 2,
        this.totalPages - 1,
        this.totalPages,
      ];
    }

    return [
      1,
      'ellipsis',
      this.currentPage - 1,
      this.currentPage,
      this.currentPage + 1,
      'ellipsis',
      this.totalPages,
    ];
  }

  get resultPerPageOptionList(): number[] {
    return Array.from([8, 10, 20, 30, 40, 50]);
  }

  onOptionChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(selectedValue);
    this.pageSizeEmitter.emit(this.pageSize);
  }
}
