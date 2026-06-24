const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A book must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A book name must have less or equal 40 characters'],
      minlength: [10, 'A book name must have more or equal 10 characters'],
    },
    slug: String,
    authors: [
      {
        name: {
          type: String,
          required: [true, 'An author must have name'],
          trim: true,
        },
        country: {
          type: String,
          default: 'unknown',
          trim: true,
        },
        _id: false,
      },
    ],

    primaryGenre: {
      type: String,
      required: [true, 'A book must have a genre'],
    },
    genres: [String],
    tags: [String],

    pages: {
      type: Number,
      required: [true, 'A book must have page count'],
    },

    price: {
      type: Number,
      required: [true, 'A book must have a price'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: `Discout price ({VALUE}) should be less than regular price`,
      },
    },

    stock: {
      type: Number,
      required: [true, 'A book must have stock quantity'],
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be above 1.0'],
      max: [5, 'Ratings must be below 5.0'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    editions: [
      {
        format: String,
        language: String,
        publishDate: Date,
        isbn: String,
        price: Number,
        stock: Number,
        _id: false,
      },
    ],

    salesHistory: [
      {
        soldAt: Date,
        quantity: Number,
        salePrice: Number,
        _id: false,
      },
    ],
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
      default: Date.now,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

bookSchema.virtual('finalPrice').get(function () {
  return this.price - this.priceDiscount;
});
bookSchema.virtual('totalSold').get(function () {
  return this.salesHistory.reduce((total, sale) => total + sale.quantity, 0);
});
bookSchema.virtual('totalRevenue').get(function () {
  return this.salesHistory.reduce(
    (total, sale) => total + sale.quantity * sale.salePrice,
    0,
  );
});

// DOCUMENT MIDDLEWARE
bookSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

bookSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});

// QUERY MIDDLEWARE
bookSchema.pre(/^find/, function (next) {
  this.find({ stock: { $gt: 0 } });
  this.start = Date.now();
  next();
});
bookSchema.post(/^find/, function (docs, next) {
  // console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  this.find({ stock: { $gt: 0 } });
  // console.log(docs)
  next();
});

// AGREGATION MIDDLEWARE
bookSchema.pre('aggregate', function (next) {
  // unshift is used to insert an element at the beginning of the array
  this.pipeline().unshift({ $match: { stock: { $gt: 0 } } });
  // console.log(this.pipeline())
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
