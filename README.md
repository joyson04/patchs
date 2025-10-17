Vulnerable Demo App (Node.js + MySQL)

This small app intentionally contains SQL injection and XSS vulnerabilities for learning and local testing only. Do NOT deploy to production.

Files:
- `app.js` - Express server with routes for home, register, login, profile.
- `views/` - EJS templates.
- `public/style.css` - basic styles.
- `db.sql` - MySQL schema and example data.
- `package.json` - dependencies.

Quick start (Windows PowerShell):

1. Create the MySQL database and table:

   # Import schema into your MySQL server
   mysql -u root -p < db.sql

2. Install dependencies and start server:

   npm install
   npm start

3. Open http://localhost:3000

Vulnerabilities and remediation notes:

- SQL Injection: `app.js` uses string concatenation to build SQL queries. Use parameterized queries / prepared statements (e.g., use `db.execute` with `?` placeholders) or an ORM.

- XSS: `profile.ejs` renders `bio` without escaping. Escape output or sanitize input. Use templating auto-escaping and Content Security Policy (CSP).

Use this project for local testing only.
