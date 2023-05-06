const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./services/db");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const multer = require('multer');

const app = express();




app.use('/styles', express.static('styles'));
app.use('/utils', express.static('utils'));
app.use(express.static("static"));
app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Configure session middleware
app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    // User is logged in, proceed to next middleware or route handler
    next();
  } else {
    // User is not logged in, redirect to login page
    res.redirect('/login');
  }
}


// Define middleware to check if user is logged in as admin
function requireAdmin(req, res, next) {
  if (req.session.admin) {
    // User is logged in as admin, allow access to route
    next();
  } else {
    // User is not logged in as admin, render "Access Denied" page
    res.status(403).render("admin/access-denied");
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'cover') {
      cb(null, 'public/covers/');
    } else if (file.fieldname === 'audio') {
      cb(null, 'public/audios/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Helper function to check user credentials
async function getUserByEmailAndPassword(email, password) {
  const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!result || !result.length) {
    return null;
  }
  const user = result[0];
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return null;
  }
  delete user.password; // Don't return the password in the user object
  return user;
}

// Login
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmailAndPassword(email, password);

    if (user) {
      // Successful login, store user in session
      req.session.user = user;
      res.redirect("/");
    } else {
      // Invalid email or password
      res.render("login", {
        message: "Invalid email or password.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Register (GET)
app.get("/register", (req, res) => {
  res.render("register");
});

// Register (POST)
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, "confirm-password": confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.render("register", { message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.render("register", { message: "Passwords do not match" });
    }

    await db.createUser(name, email, password);

    // Redirect to /login after successful registration
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render("register", { message: "An error occurred while registering the user" });
  }
});

// Logout
app.get("/logout", (req, res) => {
  // Destroy session and redirect to login page
  req.session.destroy();
  res.redirect("/login");
});

// add books
app.post('/admin/addbooks',  upload.fields([{ name: 'audio', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, author, genre, language, publication_date, description, cover } = req.body;
    if (!req.files['audio'] || req.files['audio'].length === 0) {
      res.status(400).json({ status: 'error', message: 'Audio file is missing' });
      return;
    }
    const audio = req.files['audio'][0].path;

    await db.query(
      'INSERT INTO books (title, author, genre, language, publication_date, description, cover, audio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author, genre, language, publication_date, description, cover, audio]
    );

    // Return a JSON response with the status property set to "success"
    res.status(200).json({ status: 'success' });
     
  } catch (error) {
    console.error('Error in /addBook route:', error);
    // Return a JSON response with the status property set to "error"
    res.status(500).json({ status: 'error', message: 'An error occurred while adding the book' });
  }
});





// Add this route in your server code (app.js)
app.get("/books/:bookId", requireLogin, async (req, res) => {
  const bookId = req.params.bookId;
  const book = await db.getBookById(bookId);
  if (book) {
    // Set the correct audio path
    book.audio = `/audios/${path.basename(book.audio)}`;
    res.render("book-details", { book });
  } else {
    res.status(404).send("Book not found");
  }
});



// Routes that require login
app.get("/admin/addbook",requireAdmin, (req, res) => {
  res.render("admin/addbooks");
});




app.get("/", requireLogin, async (req, res) => {
  try {
    const biographyBooks = await db.getBooksByGenre('Biography');
    const horrorBooks = await db.getBooksByGenre('Horror');
    const fantasyBooks = await db.getBooksByGenre('Fantasy');
    res.render("index", { biographyBooks, horrorBooks, fantasyBooks });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching books from the database");
  }
});



// Logout
app.get("/logout", (req, res) => {
  // Destroy session and redirect to login page
  req.session.destroy();
  res.redirect("/login");
});


// Register as admin (GET)
app.get("/admin/register",requireAdmin, (req, res) => {
  res.render("admin/register");
});

// Register as admin (POST)
app.post("/admin/register", async (req, res) => {
  try {
    const { email, password, "confirm-password": confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.render("admin/register", { message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.render("admin/register", { message: "Passwords do not match" });
    }

    await db.createAdminUser(email, password);

    // Redirect to /login after successful registration
    res.redirect('/admin/login');
  } catch (error) {
    console.error(error);
    res.render("admin/register", { message: "An error occurred while registering the user" });
  }
});



// Admin Login

// Admin Login (GET)
app.get('/admin/login', (req, res) => {
  res.render('admin/login');
});

// Admin Login (POST)
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await db.getAdminByEmail(email);

    if (admin && admin.password === password) {
      // Successful login, store admin in session
      req.session.admin = admin;
      res.redirect("/admin/dashboard");
    } else {
      // Invalid email or password
      res.render("admin/login", {
        message: "Invalid email or password.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Route to display the dashboard
app.get("/admin/dashboard",requireAdmin, async (req, res) => {
  try {
    const books = await db.getAllBooks();
    res.render("admin/dashboard", { books });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Route to display the edit book form
app.get("/admin/books/edit/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await db.getBookById(bookId);
    res.render("admin/edit-book", { book });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update a book
app.post("/admin/books/edit/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, genre } = req.body;
    await db.updateBook(bookId, title, author, genre);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to delete a book
app.post("/admin/books/delete/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    await db.deleteBook(bookId);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});




// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});