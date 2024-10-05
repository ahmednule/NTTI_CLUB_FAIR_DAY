const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { sequelize, User } = require('./models');  // Note: Changed from 'user' to 'User'
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;

// Routes
app.get('/', (req, res) => {
    res.render('signup', { title: 'Signup' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/services', (req, res) => {
    res.render('services', { title: 'Services' });
});

app.get('/home', (req, res) => {
    res.render('home', { title: 'Home' });
});

// Signup route
app.post('/users', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            console.log(req.body);
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.redirect('/home');  // Redirect after successful signup
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists in the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Compare submitted password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Redirect to the home page after successful login
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    sequelize.authenticate().then(() => {
        console.log('Database connected');
    }).catch((error) => {
        console.log('Error connecting to database', error);
    });
});
