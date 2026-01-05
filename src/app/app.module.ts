import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { BooksListComponent } from "./components/books-list/books-list.component";
import { BookCardComponent } from "./components/book-card/book-card.component";
import { CartModalComponent } from "./components/cart-modal/cart-modal.component";
import { AuthorsListComponent } from "./components/authors-list/authors-list.component";
import { BooksManagementComponent } from "./components/books-management/books-management.component";
import { OrdersListComponent } from "./components/orders-list/orders-list.component";
import { NotificationComponent } from "./components/notification/notification.component";
import { LoginComponent } from "./components/login/login.component";
import { UserAccountComponent } from "./components/user-account/user-account.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BooksListComponent,
    BookCardComponent,
    CartModalComponent,
    AuthorsListComponent,
    BooksManagementComponent,
    OrdersListComponent,
    NotificationComponent,
    LoginComponent,
    UserAccountComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
