const express = require('express');
const Book = require('../models/bookModel');
const APIFeatures=require('./../utils/apiFeatures')

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

exports.getAllBooks = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getBook = async (req, res) => {
  console.log(req.params);

  try {
    /*  
    the function findById & findOne only return the object not the array
    Book.findById(req.param.id)function same as
    Book.findOne({_id:req.params.id})
    */
    const book = await Book.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        book: book,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'err',
    });
  }
};

exports.createBook = async (req, res) => {
  // console.log(req.body);

  /*
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

  try {
    const newBook = await Book.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        book: newBook,
      },
    });
  } catch (err) {
    res.status(400).json({
      staus: 'fail',
      message: err,
    });
  }
};

exports.updateBook = async (req, res) => {
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

  try {
    res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
