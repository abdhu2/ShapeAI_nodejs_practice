// MAIN BACKEND FILE

const db = require("./database");
const express = require('express');
const BookModel = require("./database/book");
//const {MongoClient} = require('mongodb'); 
//const { json } = require("express");
const app = express ();
app.use(express.json());


var mongoose = require('mongoose');
var mongodb = "mongodb+srv://Ibrahim_Abdalla:Abdhu-97@cluster0.dy0ej.mongodb.net/BOOK-COMPANY?retryWrites=true&w=majority";
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log("CONNECTED"));



// this also one of the method connect db
//const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://Ibrahim_Abdalla:Abdhu-97@cluster0.dy0ej.mongodb.net/BOOK-COMPANY?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("BOOK-COMPANY").collection("books").findOne({ISBN:"12345Three"});
//   console.log(collection);
//   // perform actions on the collection object
//   collection.then((data)=>console.log(data)).catch((err)=>console.log(err));
// });
// client.close();








//localhost:3000
app.get ("/",(req, res)=>{
    return res.json("welcome to my company");
});

// localhost:300/books
app.get("/books",async(req,res)=>{
    const getAllBooks =await BookModel.find();
    return res.json(getAllBooks);
});


//localhost:3000/book-isbn/12345Two
app.get("/book-isbn/:isbn",async(req, res)=>{
    const {isbn}= req.params;
    //console.log(isbn);
    const getSpecificBook = await BookModel.findOne({ISBN :isbn });
   // console.log(GetSpecificBook);
   if(getSpecificBook===null){
       return res.json({"Error " : `No book is found for this ISBN ${isbn}`});
   }
   return res.json(getSpecificBook);
});

//localhost:3000/book-category/programming
app.get("/book-category/:category",async (req,res)=>{
    const {category}=req.params;
    const getSpecificBooks = await BookModel.find({category:category});

    if(getSpecificBooks.length ===0){
        return res.json({"Error": `No book avilable for this category : ${category}`});
    }
    return res.json(getSpecificBooks);
});

//localhost:3000/authors
// app.get("/authors",async(req,res)=>{

//     const getAllAuthors =await BookModel.find();
//     return res.json(getAllAuthors);
// });

//localhost:3000/auther-id/1
// app.get("/author-id/:id",async (req,res)=>{
//     let {id}=req.params;
//    // id = Number(id);
//     const getSpecificAuthor = await BookModel.findOne({id : id});

//     if(getSpecificAuthor === null)
//     {
//         return res.json({"Error ":`There is no Author founded for this id ${id}`});
//     }
//     return res.json(getSpecificAuthor[0]);
// });

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
app.post("/book", async(req, res) => {
   // const  {newBook}=req.body;
   const addNewBook =await BookModel.create(req.body);
   return res.json({
       books:addNewBook,
       message:"book was added"
   });
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

//localhost:3000/book-update/12345Three
app.put("/book-update/:isbn",async(req,res)=>{
    const {isbn}=req.params;
    const updateBook = await BookModel.findOneAndUpdate({ISBN : isbn}, req.body, {new : true});
    return res.json({bookUpdated : updateBook, message : "book was updated!!!"});
   
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
app.delete("/book-delete/:isbn",async(req,res)=>{
    const {isbn}=req.params;
    const deleteBook = await BookModel.deleteOne({ISBN : isbn});
    return res.json({bookDeleted : deleteBook, message : "book was deleted!!!"});
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

