const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User has been successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists in the server!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user due to incomplete credentials."});
});


// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.send(JSON.stringify(books));
// });

const fetchBooks = () => {
  return new Promise((resolve, reject) => {
    // Simulate asynchronous delay
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulating a delay of 1 second
  });
};

// Route definition
public_users.get('/', function (req, res) {
  // Call fetchBooks which returns a promise
  fetchBooks()
    .then((books) => {
      // Send 'books' as JSON response
      return res.json(books);
    })
    .catch((error) => {
      // Handle errors if any
      console.error('Error fetching or sending books:', error);
      return res.status(500).send('Error fetching or sending books');
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  fetchBooks()
  .then((books) => {
    isbn= req.params.isbn;
    return res.send(books[isbn]);
  })
  .catch((error) => {
    // Handle errors if any
    console.error('Error fetching or sending book:', error);
    return res.status(500).send('Error fetching or sending book');
  });
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  fetchBooks()
  .then((books) => {
    author= req.params.author;
    const array1 = Object.values(books);
    filt_author= array1.filter((book)=> book.author=== author)
    return res.send(filt_author);
  })
  .catch((error) => {
    // Handle errors if any
    console.error('Error fetching or sending book:', error);
    return res.status(500).send('Error fetching or sending book');
  });
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  fetchBooks()
  .then((books) => {
    title= req.params.title;
    const array2 = Object.values(books);
    filt_title= array2.filter((book)=> book.title=== title)
    return res.send(filt_title);
  })
  .catch((error) => {
    // Handle errors if any
    console.error('Error fetching or sending book:', error);
    return res.status(500).send('Error fetching or sending book');
  });
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn= req.params.isbn;
  return res.send(books[isbn].reviews);

});


module.exports.general = public_users;
