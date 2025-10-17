const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'dev-secret', resave: false, saveUninitialized: true }));

// NOTE: Intentionally insecure database usage for demo/testing only.
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vuln_demo'
});

db.connect(err => {
  if (err) {
    console.error('DB connect error:', err.message);
  } else {
    console.log('Connected to MySQL');
  }
});

// Home
app.get('/', (req, res) => {
  res.render('home', { user: req.session.user });
});

// Register (vulnerable - uses string concatenation)
app.get('/register', (req, res) => res.render('register', { error: null }));
app.post('/register', (req, res) => {
  const { username, password, bio } = req.body;
  if (!username || !password) return res.render('register', { error: 'Missing fields' });
  const sql = `INSERT INTO users (username, password, bio) VALUES ('${username}', '${password}', '${bio || ''}')`;
  db.query(sql, (err, result) => {
    if (err) return res.render('register', { error: err.message });
    res.redirect('/login');
  });
});

// Login (vulnerable - SQL injection possible)
app.get('/login', (req, res) => res.render('login', { error: null }));
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT id, username, bio FROM users WHERE username = '${username}' AND password = '${password}' LIMIT 1`;
  db.query(sql, (err, results) => {
    if (err) return res.render('login', { error: err.message });
    if (results.length === 0) return res.render('login', { error: 'Invalid credentials' });
    req.session.user = results[0];
    res.redirect('/profile');
  });
});

// Profile (reflects bio without encoding -> XSS)
app.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const userId = req.session.user.id;
  const sql = `SELECT id, username, bio FROM users WHERE id = ${userId}`;
  db.query(sql, (err, results) => {
    if (err) return res.send('DB error');
    if (results.length === 0) return res.send('User not found');
    // Intentionally render bio as-is to demonstrate XSS
    res.render('profile', { user: results[0] });
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on http://localhost:${port}`));
