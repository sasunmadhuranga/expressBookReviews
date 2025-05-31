const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists. Please choose another one." });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});



public_users.get('/', async function (req, res) {
  try {
    const allBooks = await new Promise((resolve, reject) => {
      resolve(books);
    });
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books." });
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});


  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const booksByAuthor = await new Promise((resolve) => {
      const matchingBooks = Object.values(books).filter(book => book.author === author);
      resolve(matchingBooks);
    });
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author." });
  }
});



// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const booksByTitle = await new Promise((resolve) => {
      const matchingBooks = Object.values(books).filter(book => book.title === title);
      resolve(matchingBooks);
    });
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title." });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found with the given ISBN." });
  }
});

module.exports.general = public_users;
