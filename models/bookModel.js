const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    // this is validator
    required: [true, 'A book must have a name'],
    unique: true,
  },
  
  author: {
    type: String,
  },

  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A book must have a price'],
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
