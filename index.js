// MAIN BACKEND FILE

const db = require("./database/index.js");


const express = require('express');
const { json } = require("express");
const app = express ();

//localhost:3000
app.get ("/",(req, res)=>{
    return res.json("welcome to my company");
});

// localhost:300/books
app.get("/books",(req,res)=>{
    const getAllBooks =db.books;
    return res.json(getAllBooks);
});


//localhost:3000/book-isbn/12345Two
app.get("/book-isbn/:isbn",(req, res)=>{
    const {isbn}= req.params;
    //console.log(isbn);
    const getSpecificBook =db.books.filter((book)=>book.ISBN === isbn);
   // console.log(GetSpecificBook);
   if(getSpecificBook.length ===0){
       return res.json({"Error " : `No book is found for this ISBN ${isbn}`});
   }
   return res.json(getSpecificBook[0]);
});

//localhost:3000/book-category/programming
app.get("/book-category/:category",(req,res)=>{
    const {category}=req.params;
    const getSpecificBooks = db.books.filter((book)=>book.category.includes(category));

    if(getSpecificBooks.length ===0){
        return res.json({"Error": `No book avilable for this category : ${category}`});
    }
    return res.json(getSpecificBooks);
});

//localhost:3000/authors
app.get("/authors" ,(req,res)=>{
    const getAllAuthors =db.authors;
    return res.json(getAllAuthors);
});

//localhost:3000/auther-id/1
app.get("/author-id/:id", (req,res)=>{
    let {id}=req.params;
    id = Number(id);
    const getSpecificAuthor =db.authors.filter((author)=>author.id === id);

    if(getSpecificAuthor.length ===0)
    {
        return res.json({"Error ":`There is no Author founded for this id ${id}`});
    }
    return res.json(getSpecificAuthor[0]);
});

//localhost:3000/author-isbn/12345Two
app.get("/author-isbn/:isbn",(req,res)=>{
    const {isbn}=req.params;
   
    const getAuthorsIsbn = db.authors.filter((author)=>author.books.includes(isbn));

     if(getAuthorsIsbn.length ===0)
     {
         return res.json({"Error ":`There is no Author founded for this isbn ${isbn}`});
     }
         return res.json(getAuthorsIsbn);
});

//localhost:3000/publications
app.get("/publications", (req, res) => {
    const getAllPublications = db.publications;
    return res.json(getAllPublications);
});

//localhost:3000/publication-isbn/12345Two
app.get("/publication-isbn/:isbn", (req, res) => {

    const {isbn}=req.params;
    const getPublicationByIsbn= db.publications.filter((publication)=> publication.books.includes(isbn) );
    if(getPublicationByIsbn.length ===0)
    {
        return res.json({"Error ":`There is no publication founded for this isbn ${isbn}`});
    }
        return res.json(getPublicationByIsbn);
   
});


app.listen(3000, ()=>{
    console.log("my express app is running....successfully");
});

