import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BooksListComponent } from "./components/books-list/books-list.component";
import { AuthorsListComponent } from "./components/authors-list/authors-list.component";
import { BooksManagementComponent } from "./components/books-management/books-management.component";
import { OrdersListComponent } from "./components/orders-list/orders-list.component";
import { LoginComponent } from "./components/login/login.component";
import { UserAccountComponent } from "./components/user-account/user-account.component";

const routes: Routes = [
  { path: "", component: BooksListComponent },
  { path: "authors", component: AuthorsListComponent },
  { path: "books-management", component: BooksManagementComponent },
  { path: "orders", component: OrdersListComponent },
  { path: "login", component: LoginComponent },
  { path: "account", component: UserAccountComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
