import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Book } from "../../models/book.model";

@Component({
  selector: "app-book-card",
  templateUrl: "./book-card.component.html",
  styleUrls: ["./book-card.component.css"],
})
export class BookCardComponent {
  @Input() book!: Book;
  @Input() isInCart = false;
  @Output() addToCart = new EventEmitter<Book>();
  @Output() showDetails = new EventEmitter<Book>();

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.book);
  }

  onShowDetails(): void {
    this.showDetails.emit(this.book);
  }

  get authorsText(): string {
    return this.book.authors
      .map((a) => `${a.firstName} ${a.lastName}`)
      .join(", ");
  }

  get stockClass(): string {
    if (this.book.available > 10) return "in-stock";
    if (this.book.available > 0) return "low-stock";
    return "out-of-stock";
  }

  get stockText(): string {
    return this.book.available > 0
      ? `In stock: ${this.book.available}`
      : "Out of stock";
  }
}
