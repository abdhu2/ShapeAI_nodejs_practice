// MAIN BACKEND FILE

const db = require("./database/index.js");


const express = require('express');
const { json } = require("express");
const app = express ();
app.use(express.json());

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

//localhost:3000/book
app.post("/book", (req, res) => {
   // const  {newBook}=req.body;
    db.books.push(req.body);
   // console.log(newBook);
    return res.json(db.books);
});

//localhost:3000/author
app.post("/author", (req, res) => {
    // console.log(req.body);
    db.authors.push(req.body);
    return res.json(db.authors);
});

//localhost:3000/publication
app.post("/publication", (req, res) => {

    db.publications.push(req.body);
    //console.log(req.body);
    return res.json(db.publications);
});

//localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn",(req,res)=>{
    const {isbn}=req.params;
    db.books.forEach((book)=>{
        if(book.ISBN === isbn) {
           // console.log({...book, ...req.body});
            return {...book, ...req.body};
        }
        return book;
    })
    return res.json(db.books);
});

//localhost:3000/author-update/1
app.put("/author-update/:id", (req, res) => {
    let {id}= req.params;
    id = Number(id);
    db.authors.forEach((author)=>{
        if(author.id === id)
        {
            //console.log({...author, ...req.body});
            return {...author, ...req.body};
        }
        return author;
    })
    return res.json(db.authors);
});

//localhost:3000/publication-update/1
app.put("/publication-update/:id", (req, res) => {
    let {id} = req.params;
    id = Number(id);
    db.publications.forEach((publication)=>{
        if(publication.id === id)
        {
            console.log({...publication,...req.body});
            return {...publication,...req.body};
        }
        return publication;
    })
    return res.json(db.publications);
});

//localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn",(req,res)=>{
    const {isbn}=req.params;
   const filteredBook= db.books.filter((book)=>book.ISBN !== isbn);
 //  console.log(filteredBook);
   db.books=filteredBook;
   return res,json(db.books);

});

//localhost:3000/book-author-delete/12345ONE/1
app.delete("/book-author-delete/:isbn/:id",(req,res)=>{
    let {isbn,id}= req.params;
    id=Number(id);
    db.books.forEach((book)=>{
        if(book.ISBN ===isbn){
            if(!book.authors.includes(id)){
                return;
            }
            book.authors=book.authors.filter((author)=> author!=id);
            return book;
        }
        return book;
    })
    return res.json(db.books);
});

//localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:id/:isbn", (req, res) => {
    let {id,isbn}=req.params;
    id =Number(id);
    db.authors.forEach((author)=>{
        if(author.id === id){
            if(!author.books.includes(isbn)){
                return;
            }
            author.books=author.books.filter((book)=> book!=isbn);
            return author;
        }
        return author;
    });
    return res.json(db.authors);

});

//localhost:3000/author-delete/1
app.delete("/author-delete/:id", (req, res) => {
    let {id}= req.params;
    id = Number(id);

    const filteredAuthors = db.authors.filter((author)=> author.id!==id);
    //console.log(filteredAuthors);
    db.authors=filteredAuthors;
    return res.json(db.authors);


});

//localhost:3000/publication-delete/2
app.delete("/publication-delete/:id", (req, res) => {
    let {id}= req.params;
    id = Number(id);
    const filteredPublications = db.publications.filter((publication)=> publication.id!==id);
    console.log(filteredPublications);
    db.publications=filteredPublications;
    return res.json(db.publications);
});



app.listen(3000, ()=>{
    console.log("my express app is running....successfully");
});

