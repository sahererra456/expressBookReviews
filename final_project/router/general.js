const express = require('express');
const router = express.Router();


const books = [
    { id: 1, title: "Book One", author: "Author One", year: 2001, reviews: [] },
    { id: 2, title: "Book Two", author: "Author Two", year: 2002, reviews: [] },
    { id: 3, title: "Book Three", author: "Author Three", year: 2003, reviews: [] },
];

// Task 1: Obtener la lista de todos los libros
router.get('/', (req, res) => {
    res.json(books);
});

// Task 2: Obtener detalles de un libro basado en ISBN
router.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find(b => b.id === parseInt(isbn)); 
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// Task 3: Obtener libros por autor
router.get('/author/:author', (req, res) => {
    const { author } = req.params;
    const filteredBooks = books.filter(b => b.author.toLowerCase() === author.toLowerCase());
    res.json(filteredBooks);
});

// Task 4: Obtener libros por título
router.get('/title/:title', (req, res) => {
    const { title } = req.params;
    const filteredBooks = books.filter(b => b.title.toLowerCase() === title.toLowerCase());
    res.json(filteredBooks);
});

// Task 5: Obtener reseñas por ISBN
router.get('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find(b => b.id === parseInt(isbn));
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).send('Book not found');
    }
});

// Task 6: Registro de un nuevo usuario
const users = [];  
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('Username already exists.');
    }
    users.push({ username, password }); 
    res.send('User registered successfully.');
});

// Task 7: Inicio de sesión de un usuario registrado
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).send('Invalid username or password.');
    }
    const token = jwt.sign({ id: username }, "your_secret_key", { expiresIn: '1h' });
    req.session.username = username; 
    res.json({ auth: true, token });
});

// Task 8: Agregar o modificar una reseña
router.post('/review', (req, res) => {
    const { isbn, review } = req.body;
    const book = books.find(b => b.id === parseInt(isbn));
    if (!book) {
        return res.status(404).send('Book not found');
    }
    const username = req.session.username;
    if (!username) {
        return res.status(403).send('User not authenticated');
    }

    const existingReviewIndex = book.reviews.findIndex(r => r.username === username);
    if (existingReviewIndex > -1) {
        book.reviews[existingReviewIndex].review = review; 
        book.reviews.push({ username, review }); 
    }
    res.send('Review added/modified successfully.');
});

// Task 9: Eliminar una reseña de libro
router.delete('/auth/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find(b => b.id === parseInt(isbn));
    if (!book) {
        return res.status(404).send('Book not found');
    }
    const username = req.session.username;
    if (!username) {
        return res.status(403).send('User not authenticated');
    }

    const reviewIndex = book.reviews.findIndex(r => r.username === username);
    if (reviewIndex > -1) {
        book.reviews.splice(reviewIndex, 1); 
        res.send('Review deleted successfully.');
    } else {
        res.status(404).send('Review not found');
    }
});
// Task 10: Obtener lista de libros usando Axios y Promesas
router.get('/axios/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books'); // Asegúrate de que esta URL sea accesible
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
});

// Task 11: Obtener detalles de un libro basado en ISBN usando Axios
router.get('/axios/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching book details');
    }
});

// Task 12: Obtener libros por autor usando Axios
router.get('/axios/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const response = await axios.get(`http://localhost:5000/books/author/${author}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching books by author');
    }
});

// Task 13: Obtener libros por título usando Axios
router.get('/axios/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const response = await axios.get(`http://localhost:5000/books/title/${title}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching books by title');
    }
});

module.exports = { general: router };
