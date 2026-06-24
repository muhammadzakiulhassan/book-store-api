const express = require('express');
const Book = require('../models/bookModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync=require('./../utils/catchAsync')
const AppError=require('./../utils/appError')

exports.aliasTopBooks = (req, res, next) => {
  console.log('1. before', req.query);
  req.aliasQuery = {
    limit: '3',
    sort: '-ratingsAverage,-price',
    fields: 'name,author,genre,price,ratingsAverage,summary',
  };
  console.log('2. after aliasQuery', req.aliasQuery);
  next();
};

exports.getAllBooks = catchAsync(async (req, res,next) => {
 

    const reqQuery = {
      ...req.query,
      ...(req.aliasQuery || {}),
    };

    // EXECUTE A QUERY

    const features = new APIFeatures(Book.find(), reqQuery)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const books = await features.query;

    res.status(200).json({
      status: 'success',

      result: books.length,
      data: {
        books,
      },
    });

});

exports.getBook = catchAsync(async (req, res,next) => {
  console.log(req.params);

 
    /*  
    the function findById & findOne only return the object not the array
    Book.findById(req.param.id)function same as
    Book.findOne({_id:req.params.id})
    */
    const book = await Book.findById(req.params.id);
    if(!book){
      return next(new AppError(`no book found of that ID`,404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        book: book,
      },
    });

});

exports.createBook = catchAsync(async (req, res,next) => {
  // console.log(req.body);

    const newBook = await Book.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        book: newBook,
      },
    });
 });  /*
  1st method => to create the document
  const newBook=new Book({})
  newBook.save();
  save()=>return promise
  */

  /*
    2nd method=> apply create method on the model
    Create=>return promoise . and promise utilize by two ways
    1. then 
    2. async await function
    in my case model is Book
    */


exports.updateBook =catchAsync( async (req, res,next) => {
  /*
  A.findByIdAndUpdate(id, update, options)  // returns Query
  A.findByIdAndUpdate(id, update)           // returns Query
  A.findByIdAndUpdate()                     // returns Query
  */

  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    // it send the modified document instead of original doc=> new:true
    new: true,
    runValidators: true,
  });

  if(!book){
      return next(new AppError(`no book found of that ID`,404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
 
});

exports.deleteBook = catchAsync(async (req, res,next) => {
 
   const book= await Book.findByIdAndDelete(req.params.id);

     if(!book){
      return next(new AppError(`no book found of that ID`,404))
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
 
});

exports.getBookStats = catchAsync(async (req, res,next) => {

    const stats = await Book.aggregate([
      {
        $match: {
          ratingsAverage: { $gt: 4.5 },
        },
      },
      {
        $group: {
          _id: '$primaryGenre',
          numBooks: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalStock: { $sum: '$stock' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });

});

// Which tags are most common in our bookstore?
exports.popularTags = catchAsync(async (req, res,next) => {

    const tag = await Book.aggregate([
      {
        $unwind: '$tags',
      },
      {
        $group: {
          _id: '$tags',
          numTags: { $sum: 1 },
        },
      },
      {
        $sort: {
          numTags: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        tag,
      },
    });
  
});


// Which books generated the most revenue?



