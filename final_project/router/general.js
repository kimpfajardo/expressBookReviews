const express = require("express");
let books = require("./booksdb.js");
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const missing = [];
  if (!username) missing.push("Username");
  if (!password) missing.push("Password");

  const errorString = `${missing.join(" and ")} missing`;

  if (missing.length) {
    return res.status(400).json({ message: errorString });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username is invalid" });
  }

  const existingUser = authenticatedUser(username, password);

  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  return res.status(201).json({ message: "Registration successful" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  if (!req.params.isbn) {
    return res.status(400).json({ message: "ISBN is missing" });
  }
  const book = books[`${req.params.isbn}`];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  if (!req.params.author) {
    return res.status(400).json({ message: "Author name is missing" });
  }
  const book = Object.values(books).filter((_book) =>
    _book.author.toLowerCase().includes(req.params.author.toLowerCase())
  );
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  if (!req.params.title) {
    return res.status(400).json({ message: "Book title is missing" });
  }
  const book = Object.values(books).filter((_book) =>
    _book.title.toLowerCase().includes(req.params.title.toLowerCase())
  );
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  if (!req.params.isbn) {
    return res.status(400).json({ message: "ISBN is missing" });
  }
  const book = books[`${req.params.isbn}`];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
