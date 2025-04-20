const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "kimfajardo",
    password: "1234",
  },
];

const isValid = (username) => {
  const min = 3;
  const max = 20;
  return (
    !!username &&
    typeof username === "string" &&
    username.length > min &&
    username.length <= max
  );
};

const getExistingUser = (username, password) => {
  const user = users.filter(
    (_user) =>
      _user.username.toLowerCase() === username.toLowerCase() &&
      _user.password === password
  )?.[0];

  return user;
};

const authenticatedUser = (username, password) => {
  return !!getExistingUser(username, password);
};

//only registered users can login
regd_users.post("/login", (req, res) => {
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

  const existingUser = getExistingUser(username, password);

  if (!existingUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    const token = jwt.sign({ username }, "fingerprint_customer", {
      expiresIn: "1 day",
    });

    req.session.token = token;
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username } = req.user;
  const { review } = req.body;
  const { isbn } = req.params;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is missing" });
  }

  if (!review) {
    return res.status(400).json({ message: "Error saving review" });
  }

  const book = books[`${isbn}`];

  const updatedBookDB = { ...books };

  updatedBookDB[`${isbn}`] = {
    ...book,
    review: {
      ...book.reviews,
      [username]: review,
    },
  };
  books = updatedBookDB;

  return res.status(201).json({ message: "Review submitted successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.user;
  const { isbn } = req.params;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is missing" });
  }

  const book = books[`${isbn}`];

  const updatedBookDB = { ...books };
  const updateReviewsFromBook = { ...book.reviews };

  delete updateReviewsFromBook[username];

  updatedBookDB[`${isbn}`] = {
    ...book,
    reviews: updateReviewsFromBook,
  };
  
  books = updatedBookDB;

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
