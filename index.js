// MAIN BACKEND FILE

//const db = require("./database");

const express = require('express');
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const publicationModel = require("./database/publication");
//const {MongoClient} = require('mongodb'); 
//const { json } = require("express");
const app = express ();
app.use(express.json());


var mongoose = require('mongoose');
const { json } = require("express");
var mongodb =MONGODB_URI;
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
app.get("/authors",async(req,res)=>{
    const getAllAuthors =await AuthorModel.find();
    return res.json(getAllAuthors);
});

//localhost:3000/auther-id/1
app.get("/author-id/:id",async (req,res)=>{
    const {id}=req.params;
   // id = Number(id);
    const getSpecificAuthor = await AuthorModel.findOne({id : id});

    if(getSpecificAuthor === null)
    {
        return res.json({"Error ":`There is no Author founded for this id ${id}`});
    }
    return res.json(getSpecificAuthor);
});

//localhost:3000/author-isbn/12345ONE
app.get("/author-isbn/:isbn",async(req,res)=>{
    const {isbn}=req.params;
   
    const getAuthorsByIsbn = await AuthorModel.findOne({books: isbn});
    if(getAuthorsByIsbn === null){
        return res.json({"Error ":`There is no Author founded for this id ${isbn}`});
    }
    return res.json (getAuthorsByIsbn);
});

//localhost:3000/publications
app.get("/publications", async(req, res) => {
   const getALLPublications =await publicationModel.find();
   return res.json(getALLPublications);
});

//localhost:3000/publication-isbn/12345Three
app.get("/publication-isbn/:isbn", async(req, res) => {

    const {isbn}=req.params;
    const getPublicationByIsbn= await publicationModel.findOne({books :isbn});
    if(getPublicationByIsbn===null)
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
app.post("/author", async(req, res) => {
    // console.log(req.body);
    const addNewAuthor = await AuthorModel.create(req.body);
    return res.json({
        authors:addNewAuthor,
        message: "Author was added"
    });
});

//localhost:3000/publication
app.post("/publication", async (req, res) => {
    const addNewPublication = await publicationModel.create(req.body);
    return res.json({
        publications : addNewPublication,
        message :"Publication was added"
    });
   
});

//localhost:3000/book-update/12345Three
app.put("/book-update/:isbn",async(req,res)=>{
    const {isbn}=req.params;
    const updateBook = await BookModel.findOneAndUpdate({ISBN : isbn}, req.body, {new : true});
    return res.json({bookUpdated : updateBook, message : "book was updated!!!"});
   
});

//localhost:3000/author-update/1
app.put("/author-update/:id",async (req, res) => {
    const {id}= req.params;
    //id = Number(id);
    const authorUpdate = await AuthorModel.findOneAndUpdate({id : id },req.body,{new : true});
    return res.json(authorUpdate);
    });


//localhost:3000/publication-update/1
app.put("/publication-update/:id",async (req, res) => {
    const {id} = req.params;
    const updatePublication = await publicationModel.findOneAndUpdate({id : id}, req.body, {new : true});
    return res.json(updatePublication);
});

//localhost:3000/book-delete/12345six
app.delete("/book-delete/:isbn",async(req,res)=>{
    const {isbn}=req.params;
    const deleteBook = await BookModel.deleteOne({ISBN : isbn});
    return res.json({bookDeleted : deleteBook, message : "book was deleted!!!"});
});

//localhost:3000/book-author-delete/12345ONE/1
app.delete("/book-author-delete/:isbn/:id",async(req,res)=>{
    const {isbn, id} = req.params;
    let getSpecificBook = await BookModel.findOne({ISBN: isbn});
    if(getSpecificBook===null) {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    else {
        getSpecificBook.authors.remove(id);
        const updateBook = await BookModel.findOneAndUpdate({ISBN: isbn}, getSpecificBook, {new: true});
        return res.json( {bookUpdated: updateBook, message: "Author was Deleted from the Book !!!"} );
    }
});

//localhost:3000/author-book-delete/1/12345Two
app.delete("/author-book-delete/:id/:isbn",async (req, res) => {
    const {id,isbn}=req.params;
    let getSpecificAuthor = await AuthorModel.findOne({id : id});
    if(getSpecificAuthor === null)
    {
        return res.json({"error": `No Author found for the id of ${id}`});
    }
    else{
        getSpecificAuthor.books.remove(isbn);
        const updateAuthor = await AuthorModel.findOneAndUpdate({id : id }, getSpecificAuthor, {new : true});
        return res.json({authorUpdate: updateAuthor, message: "Book was Deleted from the Author !!!"});
    }

});

//localhost:3000/author-delete/1
app.delete("/author-delete/:id",async (req, res) => {
    const {id}= req.params;

    const deleteAuthor = await AuthorModel.deleteOne({id : id});
    return res.json({authorDeleted : deleteAuthor, message : "Author was deleted!!!"});
});

//localhost:3000/publication-delete/2
app.delete("/publication-delete/:id",async (req, res) => {
    const {id}= req.params;
    const deletePublication = await publicationModel.deleteOne({id : id});
    return res.json({publicationDeleted : deletePublication, message : "Publication was deleted!!!"});
    
});



app.listen(3000, ()=>{
    console.log("my express app is running....successfully");
});

