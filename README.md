# BookstoreAPI Frontend - Angular Application

Welcome to the BookstoreAPI Frontend repository – built by [@bkita](https://github.com/bkita) and [AkademiaQA.pl](https://akademiaqa.pl).

This project demonstrates a modern, responsive Angular application for managing an online bookstore, integrated with BookstoreAPI.

This repository contains a complete frontend solution with book browsing, search functionality, shopping cart management, and responsive design patterns for building real-world e-commerce applications.

## What This Project Covers

This project demonstrates modern frontend development with a focus on practical e-commerce scenarios:

- **UI Components** with Angular (navbar, book cards, modals, shopping cart)
- **API Integration** for real-time book data and order management
- **State Management** using Angular services and LocalStorage
- **Responsive Design** with CSS Grid and mobile-first approach
- **Dark Theme** with CSS custom properties
- **Search & Filtering** for enhanced user experience

You'll see practical examples of Angular patterns like services, components, routing, and HTTP client usage with proper TypeScript typing.

By exploring this project, you'll understand how to build maintainable and scalable frontend applications for e-commerce platforms.

## 🚀 Features

- **Book List** - browse all available books
- **Search** - find books by title, author, or ISBN
- **Filters** - All Books, Available, Bestsellers
- **Book Details** - modal window with complete information
- **Shopping Cart** - order management with LocalStorage
- **Responsive Design** - works on desktop and mobile
- **Dark Theme** - consistent styling with documentation

## 📋 Prerequisites

- Node.js (version 18+)
- npm (version 9+)
- Angular CLI (version 16+)
- BookstoreAPI (available at `https://bookstoreapi.up.railway.app/`)

## 🛠️ Installation and Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run the application in development mode

```bash
npm start
# or
ng serve
```

The application will be available at: **http://localhost:4200**

### 3. API Configuration (optional)

By default, the application uses Railway API: `https://bookstoreapi.up.railway.app/`

If you want to use a local API, change the URL in:

```
src/app/services/book.service.ts
```

## 🏗️ Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navbar/           # Top navigation bar
│   │   │   ├── books-list/       # Book list + filters
│   │   │   ├── book-card/        # Single book card
│   │   │   └── cart-modal/       # Shopping cart modal
│   │   ├── models/
│   │   │   └── book.model.ts     # TypeScript interfaces
│   │   ├── services/
│   │   │   ├── book.service.ts   # API communication
│   │   │   └── cart.service.ts   # Cart management
│   │   ├── app.component.*       # Main component
│   │   ├── app.module.ts         # Application module
│   │   └── app-routing.module.ts # Routing
│   ├── styles.css                # Global styles
│   └── index.html                # Main HTML
├── angular.json                  # Angular configuration
├── package.json                  # npm dependencies
└── tsconfig.json                 # TypeScript configuration
```

## 🎨 Styling

The application uses CSS Variables (dark theme) consistent with documentation:

- `--primary-color: #2563eb` - blue accent
- `--background: #0f172a` - dark background
- `--surface: #1e293b` - card/element background
- `--text-primary: #f1f5f9` - primary text

## 📦 Production Build

```bash
npm run build
```

Production files will be in the `dist/bookstore-app/` directory.

## 🚢 Deployment to Railway

### Option 1: Static Files (recommended)

1. Build the application:

```bash
npm run build
```

2. Deploy the `dist/bookstore-app/` folder as a static site

3. Add `_redirects` file for SPA routing:

```
/*    /index.html   200
```

### Option 2: Node.js Server

Add `server.js`:

```javascript
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(__dirname + "/dist/bookstore-app"));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/bookstore-app/index.html"));
});

app.listen(process.env.PORT || 8080);
```

Update `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "ng build"
  }
}
```

## 🔗 API Endpoints Used

- `GET https://bookstoreapi.up.railway.app/books` - List all books
- `GET https://bookstoreapi.up.railway.app/books/{id}` - Book details
- `POST https://bookstoreapi.up.railway.app/orders` - Create order (TODO)

## 📱 Responsiveness

- Desktop: grid 3-4 columns
- Tablet: grid 2 columns
- Mobile: grid 1 column, modified navigation

## 🛒 Shopping Cart

- Data stored in LocalStorage
- Automatic saving on every change
- Availability validation (cannot add more than in stock)

## 🔮 Future Features

- [ ] User authentication (integration with /login)
- [ ] Authors page
- [ ] Orders page (order history)
- [ ] Book sorting
- [ ] Pagination
- [ ] Book images
- [ ] Reviews and ratings

## 📄 License

Educational project - AkademiaQA

---

**Note**: This is a frontend application. It requires the BookstoreAPI backend to be running.
