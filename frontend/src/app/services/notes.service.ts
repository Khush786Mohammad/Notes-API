import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { Notes } from '../model/notes';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  baseUrl: string = '';
  contextPath: string = '';
  constructor(private http: HttpClient) {
    this.baseUrl = env.baseUrl;
    this.contextPath = env.contextPath;
  }

  fetchAllNotes(
    pageNo: number = 0,
    pageSize: number = 8,
    sortField: 'crtDt' | 'title' = 'crtDt',
    order: 'asc' | 'desc' = 'asc',
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize)
      .set('sortField', sortField)
      .set('order', order);
    return this.http.get<any>(`${this.baseUrl + this.contextPath}/user/notes`, {
      params,
    });
  }

  searchNoteData(
    pageNo: number = 0,
    pageSize: number = 8,
    sortField: 'crtDt' | 'title' = 'crtDt',
    order: 'asc' | 'desc' = 'asc',
    searchKey = '',
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize)
      .set('sortField', sortField)
      .set('order', order)
      .set('keyword', searchKey);
    return this.http.get<any>(
      `${this.baseUrl + this.contextPath}/user/notes/search`,
      { params },
    );
  }

  addNewNote(data: any): Observable<Notes> {
    return this.http.post<Notes>(
      `${this.baseUrl + this.contextPath}/user/notes`,
      data,
    );
  }

  updateNoteById(data: any): Observable<Notes> {
    return this.http.put<Notes>(
      `${this.baseUrl + this.contextPath}/user/notes`,
      data,
    );
  }

  deleteNoteById(id: number) {
    return this.http.delete(
      `${this.baseUrl + this.contextPath}/user/notes/${id}`,
    );
  }
}
