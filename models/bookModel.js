// const mongoose = require('mongoose');

// const bookSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     // this is validator
//     required: [true, 'A book must have a name'],
//     unique: true,
//   },
  
//   author: {
//     type: String,
//   },

//   rating: {
//     type: Number,
//     default: 4.5,
//   },
//   price: {
//     type: Number,
//     required: [true, 'A book must have a price'],
//   },
// });

// const Book = mongoose.model('Book', bookSchema);

// module.exports = Book;














const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A book must have a name'],
    unique: true,
    trim: true,
  },

  author: {
    type: String,
    required: [true, 'A book must have an author'],

    // trim only work for string remove spaces before and after.
    trim: true,
  },

  genre: {
    type: String,
    required: [true, 'A book must have a genre'],
  },

  pages: {
    type: Number,
    required: [true, 'A book must have page count'],
  },

  stock: {
    type: Number,
    required: [true, 'A book must have stock quantity'],
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: [true, 'A book must have a price'],
  },

  priceDiscount: Number,

  summary: {
    type: String,
    trim: true,
    required: [true, 'A book must have a summary'],
  },

  description: {
    type: String,
    trim: true,
  },

  coverImage: {
    type: String,
    required: [true, 'A book must have a cover image'],
  },

/*
   so we have multiple images so we use array of string to store them like below
      galleryImages:[String]
    */
  galleryImages: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
    select:false
  },

  publishDates: [Date],
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;


