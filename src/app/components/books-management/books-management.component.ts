import { Component, OnInit } from "@angular/core";
import { BookService } from "../../services/book.service";
import { AuthorService } from "../../services/author.service";
import { NotificationService } from "../../services/notification.service";
import { Book, Author } from "../../models/book.model";

@Component({
  selector: "app-books-management",
  templateUrl: "./books-management.component.html",
  styleUrls: ["./books-management.component.css"],
})
export class BooksManagementComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  authors: Author[] = [];
  searchQuery: string = "";
  loading: boolean = true;

  // Modal states
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  // Form data
  bookForm = {
    title: "",
    year: new Date().getFullYear(),
    price: 0,
    available: 0,
    authors: [] as number[],
  };

  selectedBook: Book | null = null;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data.sort((a, b) => a.title.localeCompare(b.title));
        this.filteredBooks = [...this.books];
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading books:", error);
        this.loading = false;
      },
    });
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
      },
      error: (error) => {
        console.error("Error loading authors:", error);
      },
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredBooks = [...this.books];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredBooks = this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.authors.some(
          (author) =>
            author.firstName.toLowerCase().includes(query) ||
            author.lastName.toLowerCase().includes(query)
        )
    );
  }

  // Add Book
  openAddModal(): void {
    this.bookForm = {
      title: "",
      year: new Date().getFullYear(),
      price: 0,
      available: 0,
      authors: [],
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.bookForm = {
      title: "",
      year: new Date().getFullYear(),
      price: 0,
      available: 0,
      authors: [],
    };
  }

  addBook(): void {
    if (!this.bookForm.title.trim() || this.bookForm.authors.length === 0) {
      this.notificationService.warning(
        "Please fill in the title and select at least one author"
      );
      return;
    }

    if (this.bookForm.price <= 0 || this.bookForm.available < 0) {
      this.notificationService.warning(
        "Please enter valid price and available quantity"
      );
      return;
    }

    // Filter out any null/undefined values from authors array
    const cleanedAuthors = this.bookForm.authors.filter(
      (id) => id != null && id > 0
    );

    if (cleanedAuthors.length === 0) {
      this.notificationService.warning("Please select at least one author");
      return;
    }

    const bookData = {
      title: this.bookForm.title,
      year: this.bookForm.year,
      price: this.bookForm.price,
      available: this.bookForm.available,
      authors: cleanedAuthors,
    };

    this.bookService.createBook(bookData).subscribe({
      next: (newBook) => {
        this.loadBooks();
        this.closeAddModal();
        this.notificationService.success("Book added successfully!");
      },
      error: (error) => {
        console.error("Error adding book:", error);
        if (error.status === 400) {
          this.notificationService.error("Invalid data submitted");
        } else if (error.status === 409) {
          this.notificationService.error(
            "A book with this title already exists"
          );
        } else {
          this.notificationService.error(
            "Error adding book. Please try again."
          );
        }
      },
    });
  }

  // Edit Book
  openEditModal(book: Book): void {
    this.selectedBook = book;
    console.log("Opening edit modal for book:", book);
    console.log("Book authors:", book.authors);
    console.log("Available authors:", this.authors);

    // Find author IDs by matching firstName and lastName
    const authorIds = book.authors
      .map((bookAuthor) => {
        // First try to use id if it exists
        if (bookAuthor.id) {
          return bookAuthor.id;
        }

        // If no id, find the author in the full authors list by name
        const foundAuthor = this.authors.find(
          (a) =>
            a.firstName === bookAuthor.firstName &&
            a.lastName === bookAuthor.lastName
        );

        console.log(
          `Looking for author ${bookAuthor.firstName} ${bookAuthor.lastName}, found:`,
          foundAuthor
        );
        return foundAuthor?.id;
      })
      .filter((id): id is number => id != null && id > 0);

    console.log("Mapped author IDs:", authorIds);

    this.bookForm = {
      title: book.title,
      year: book.year || new Date().getFullYear(),
      price: book.price,
      available: book.available,
      authors: authorIds,
    };
    console.log("Initial form authors:", this.bookForm.authors);
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedBook = null;
    this.bookForm = {
      title: "",
      year: new Date().getFullYear(),
      price: 0,
      available: 0,
      authors: [],
    };
  }

  updateBook(): void {
    if (!this.selectedBook) return;

    if (!this.bookForm.title.trim() || this.bookForm.authors.length === 0) {
      this.notificationService.warning(
        "Please fill in the title and select at least one author"
      );
      return;
    }

    if (this.bookForm.price <= 0 || this.bookForm.available < 0) {
      this.notificationService.warning(
        "Please enter valid price and available quantity"
      );
      return;
    }

    // Filter out any null/undefined values from authors array
    const cleanedAuthors = this.bookForm.authors.filter(
      (id) => id != null && id > 0
    );

    if (cleanedAuthors.length === 0) {
      this.notificationService.warning("Please select at least one author");
      return;
    }

    const bookData = {
      title: this.bookForm.title,
      year: this.bookForm.year,
      price: this.bookForm.price,
      available: this.bookForm.available,
      authors: cleanedAuthors,
    };

    console.log("Updating book with data:", bookData);
    console.log("Selected book ID:", this.selectedBook.id);

    this.bookService.updateBook(this.selectedBook.id, bookData).subscribe({
      next: (response) => {
        console.log("Update successful:", response);
        this.loadBooks();
        this.closeEditModal();
        this.notificationService.success("Book updated successfully!");
      },
      error: (error) => {
        console.error("Error updating book:", error);
        console.error("Error details:", error.error);
        if (error.status === 400) {
          this.notificationService.error("Invalid data submitted");
        } else if (error.status === 409) {
          this.notificationService.error(
            "A book with this title already exists"
          );
        } else {
          this.notificationService.error(
            "Error updating book. Please try again."
          );
        }
      },
    });
  }

  // Delete Book
  openDeleteModal(book: Book): void {
    this.selectedBook = book;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedBook = null;
  }

  deleteBook(): void {
    if (!this.selectedBook) return;

    this.bookService.deleteBook(this.selectedBook.id).subscribe({
      next: () => {
        this.loadBooks();
        this.closeDeleteModal();
        this.notificationService.success("Book deleted successfully!");
      },
      error: (error) => {
        console.error("Error deleting book:", error);
        if (error.status === 409) {
          this.notificationService.error(
            "Cannot delete book. This book is part of existing orders."
          );
        } else {
          this.notificationService.error(
            "Error deleting book. Please try again."
          );
        }
      },
    });
  }

  // Helper methods
  toggleAuthorSelection(authorId: number): void {
    console.log("Toggle author:", authorId);
    console.log("Current authors:", this.bookForm.authors);
    const index = this.bookForm.authors.indexOf(authorId);
    if (index > -1) {
      this.bookForm.authors.splice(index, 1);
    } else {
      this.bookForm.authors.push(authorId);
    }
    console.log("After toggle:", this.bookForm.authors);
  }

  isAuthorSelected(authorId: number): boolean {
    const isSelected = this.bookForm.authors.includes(authorId);
    return isSelected;
  }

  getAuthorName(author: Author): string {
    return `${author.firstName} ${author.lastName}`;
  }

  getAuthorsText(authors: Author[]): string {
    return authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ");
  }
}
