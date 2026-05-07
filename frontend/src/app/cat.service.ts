import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface Cat {
  id?: number;
  name: string;
  birth_date: string;
  gender: 'M' | 'F';
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pets/cats/`;

  getCats() { return this.http.get<Cat[]>(this.apiUrl); }
  createCat(cat: Cat) { return this.http.post<Cat>(this.apiUrl, cat); }
  updateCat(id: number, cat: Cat) { return this.http.put<Cat>(`${this.apiUrl}${id}/`, cat); }
  deleteCat(id: number) { return this.http.delete(`${this.apiUrl}${id}/`); }
}