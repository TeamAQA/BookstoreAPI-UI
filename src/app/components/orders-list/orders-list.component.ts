import { Component, OnInit } from "@angular/core";
import { OrderService } from "../../services/order.service";
import { Order } from "../../models/book.model";

@Component({
  selector: "app-orders-list",
  templateUrl: "./orders-list.component.html",
  styleUrls: ["./orders-list.component.css"],
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchQuery: string = "";
  loading: boolean = true;
  selectedOrder: Order | null = null;
  showDetailsModal: boolean = false;

  statusColors: { [key: string]: string } = {
    NEW: "status-new",
    IN_DELIVERY: "status-delivery",
    DELIVERED: "status-delivered",
    CANCELED: "status-canceled",
    ABANDONED: "status-abandoned",
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) => b.id - a.id);
        this.filteredOrders = [...this.orders];
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading orders:", error);
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredOrders = this.orders.filter(
      (order) =>
        order.id.toString().includes(query) ||
        order.recipient.name.toLowerCase().includes(query) ||
        order.recipient.email.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
    );
  }

  openDetailsModal(order: Order): void {
    this.selectedOrder = order;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedOrder = null;
  }

  getOrderTotal(order: Order): number {
    return order.items.reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    );
  }

  getTotalQuantity(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getStatusClass(status: string): string {
    if (!status) {
      return "status-default";
    }
    return this.statusColors[status] || "status-default";
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      NEW: "New",
      IN_DELIVERY: "In Delivery",
      DELIVERED: "Delivered",
      CANCELED: "Canceled",
      ABANDONED: "Abandoned",
    };
    return labels[status] || status;
  }

  getAuthorsText(authors: any[]): string {
    return authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ");
  }
}
