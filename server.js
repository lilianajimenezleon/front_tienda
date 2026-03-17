const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde el directorio dist
app.use(express.static(path.join(__dirname, 'dist/fornt_tienda/browser')));

// Manejar todas las rutas y redirigir a index.html para que Angular maneje el routing
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/fornt_tienda/browser/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
