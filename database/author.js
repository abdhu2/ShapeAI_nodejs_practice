const mongoose = require("mongoose");

const authorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

const AuthorModel = mongoose.model("authors",authorSchema);
module.exports = AuthorModel;
