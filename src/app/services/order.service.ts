import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Order } from "../models/book.model";

export interface CreateOrderRequest {
  items: { bookId: number; quantity: number }[];
  recipient: {
    name: string;
    phone: string;
    street: string;
    city: string;
    zipCode: string;
    email: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = "https://bookstoreapi.up.railway.app/orders";

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }
}
