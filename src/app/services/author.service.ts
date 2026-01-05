import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Author } from "../models/book.model";

@Injectable({
  providedIn: "root",
})
export class AuthorService {
  private apiUrl = "https://bookstoreapi.up.railway.app/authors";

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl);
  }

  getAuthor(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/${id}`);
  }

  createAuthor(author: {
    firstName: string;
    lastName: string;
  }): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author);
  }

  updateAuthor(
    id: number,
    author: { firstName: string; lastName: string }
  ): Observable<Author> {
    return this.http.put<Author>(`${this.apiUrl}/${id}`, author);
  }

  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
