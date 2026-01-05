import { Component, OnInit } from "@angular/core";
import { AuthorService } from "../../services/author.service";
import { NotificationService } from "../../services/notification.service";
import { Author } from "../../models/book.model";

@Component({
  selector: "app-authors-list",
  templateUrl: "./authors-list.component.html",
  styleUrls: ["./authors-list.component.css"],
})
export class AuthorsListComponent implements OnInit {
  authors: Author[] = [];
  filteredAuthors: Author[] = [];
  searchQuery: string = "";
  loading: boolean = true;

  // Modal states
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  // Form data
  authorForm = {
    firstName: "",
    lastName: "",
  };

  selectedAuthor: Author | null = null;

  constructor(
    private authorService: AuthorService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.loading = true;
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
        this.filteredAuthors = [...this.authors];
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading authors:", error);
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredAuthors = [...this.authors];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredAuthors = this.authors.filter(
      (author) =>
        author.firstName.toLowerCase().includes(query) ||
        author.lastName.toLowerCase().includes(query)
    );
  }

  // Add Author
  openAddModal(): void {
    this.authorForm = { firstName: "", lastName: "" };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.authorForm = { firstName: "", lastName: "" };
  }

  addAuthor(): void {
    if (!this.authorForm.firstName.trim() || !this.authorForm.lastName.trim()) {
      this.notificationService.warning("Please fill in all fields");
      return;
    }

    this.authorService.createAuthor(this.authorForm).subscribe({
      next: (newAuthor) => {
        this.loadAuthors();
        this.closeAddModal();
        this.notificationService.success("Author added successfully!");
      },
      error: (error) => {
        console.error("Error adding author:", error);
        if (error.status === 400) {
          this.notificationService.error("Invalid data submitted");
        } else {
          this.notificationService.error(
            "Error adding author. Please try again."
          );
        }
      },
    });
  }

  // Edit Author
  openEditModal(author: Author): void {
    this.selectedAuthor = author;
    this.authorForm = {
      firstName: author.firstName,
      lastName: author.lastName,
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedAuthor = null;
    this.authorForm = { firstName: "", lastName: "" };
  }

  updateAuthor(): void {
    if (!this.selectedAuthor) return;

    if (!this.authorForm.firstName.trim() || !this.authorForm.lastName.trim()) {
      this.notificationService.warning("Please fill in all fields");
      return;
    }

    this.authorService
      .updateAuthor(this.selectedAuthor.id, this.authorForm)
      .subscribe({
        next: () => {
          this.loadAuthors();
          this.closeEditModal();
          this.notificationService.success("Author updated successfully!");
        },
        error: (error) => {
          console.error("Error updating author:", error);
          if (error.status === 400) {
            this.notificationService.error("Invalid data submitted");
          } else {
            this.notificationService.error(
              "Error updating author. Please try again."
            );
          }
        },
      });
  }

  // Delete Author
  openDeleteModal(author: Author): void {
    this.selectedAuthor = author;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedAuthor = null;
  }

  deleteAuthor(): void {
    if (!this.selectedAuthor) return;

    this.authorService.deleteAuthor(this.selectedAuthor.id).subscribe({
      next: () => {
        this.loadAuthors();
        this.closeDeleteModal();
        this.notificationService.success("Author deleted successfully!");
      },
      error: (error) => {
        console.error("Error deleting author:", error);
        if (error.status === 409) {
          this.notificationService.error(
            "Cannot delete author. This author has associated books."
          );
        } else {
          this.notificationService.error(
            "Error deleting author. Please try again."
          );
        }
      },
    });
  }
}
