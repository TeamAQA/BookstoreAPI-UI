const express = require('express');
const path = require('path');

const app = express();

// Serwuj statyczne pliki z folderu dist/bookstore-app
app.use(express.static(path.join(__dirname, 'dist/bookstore-app')));

// Wszystkie pozostałe requesty przekieruj do index.html (dla Angular routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist/bookstore-app', 'index.html'));
});

// Nasłuchuj na porcie z Railway lub domyślnie 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
