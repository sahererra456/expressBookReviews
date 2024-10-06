const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const public_routes = require('./router/general.js').general;  // Asegúrate de que la ruta es correcta
const customer_routes = require('./router/auth_users.js').authenticated;  // Para tus rutas de autenticación

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Middleware de autenticación para las rutas de clientes
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization']; 
    if (!token) {
        return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(token, "your_secret_key", (err, decoded) => {
        if (err) {
            return res.status(500).send({ message: "Failed to authenticate token" });
        }
        req.userId = decoded.id; 
        next();
    });
});

// Usar las rutas
app.use("/books", public_routes);  // Asegúrate de que se usa este prefijo para las rutas de libros
app.use("/customer", customer_routes); // Rutas de clientes

// Iniciar el servidor
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
