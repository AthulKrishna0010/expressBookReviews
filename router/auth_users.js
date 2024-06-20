const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validUsers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60*60});

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({message: "Invalid Login. Check username and password"});
  }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;

  if (!isbn || !review) {
    return res.status(403).send("ISBN and review are required");
  }

  // Retrieve session username
  const username = req.session.authorization.username; // Assuming 'authorization' object in session

  if (books.hasOwnProperty(isbn)) {
    books[isbn].reviews.push({ username, review }); // Store username with review
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).send("Book not found");
  }
});





module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
