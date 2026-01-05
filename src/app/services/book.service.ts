import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Book } from "../models/book.model";

@Injectable({
  providedIn: "root",
})
export class BookService {
  private apiUrl = "https://bookstoreapi.up.railway.app";

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  searchBooks(query: string): Observable<Book[]> {
    // This would need to be implemented on the backend
    // For now, we'll filter client-side
    return this.getBooks();
  }

  createBook(book: {
    title: string;
    year: number;
    price: number;
    available: number;
    authors: number[];
  }): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/books`, book);
  }

  updateBook(
    id: number,
    book: {
      title: string;
      year: number;
      price: number;
      available: number;
      authors: number[];
    }
  ): Observable<Book> {
    console.log(`Calling PUT ${this.apiUrl}/books/${id}`);
    console.log("Request body:", JSON.stringify(book, null, 2));
    return this.http.put<Book>(`${this.apiUrl}/books/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/books/${id}`);
  }
}
