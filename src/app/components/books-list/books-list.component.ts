import { Component, OnInit } from "@angular/core";
import { Book } from "../../models/book.model";
import { BookService } from "../../services/book.service";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-books-list",
  templateUrl: "./books-list.component.html",
  styleUrls: ["./books-list.component.css"],
})
export class BooksListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  loading = true;
  error = "";
  searchQuery = "";
  currentFilter = "all";
  selectedBook: Book | null = null;

  constructor(
    private bookService: BookService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading books:", err);
        this.error =
          "Failed to load books. Please make sure the API is running.";
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.books];

    // Apply search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((book) => {
        const title = book.title.toLowerCase();
        const authors = book.authors
          .map((a) => `${a.firstName} ${a.lastName}`.toLowerCase())
          .join(" ");
        const year = book.year ? book.year.toString() : "";
        return (
          title.includes(query) ||
          authors.includes(query) ||
          year.includes(query)
        );
      });
    }

    // Apply category filter
    if (this.currentFilter === "available") {
      filtered = filtered.filter((book) => book.available > 0);
    } else if (this.currentFilter === "bestsellers") {
      filtered = filtered.filter((book) => book.available < 50);
    }

    this.filteredBooks = filtered;
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.applyFilters();
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.applyFilters();
  }

  showBookDetails(book: Book): void {
    this.selectedBook = book;
  }

  closeBookDetails(): void {
    this.selectedBook = null;
  }

  addToCart(book: Book): void {
    this.cartService.addToCart(book);
  }

  isInCart(bookId: number): boolean {
    return this.cartService.isInCart(bookId);
  }

  getAuthorsText(book: Book): string {
    return book.authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ");
  }
}
