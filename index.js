const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { sequelize, user } = require('./models');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.render('signup', { title: 'signup' });
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

app.post('/users', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const User = await user.create({
            name,
            email,
            password
        });

        res.render('home');
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
    })
});
