/* 
import json data from file and insert into the mongodb document
   it completely run independent of express application 
   */

const fs = require('fs');
const Book = require('./../../models/bookModel.js');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });

const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD,
);
console.log(process.env.DATABASE);
console.log('FINAL URL:', DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

// convet jsonfile into js obj
const books = JSON.parse(
  fs.readFileSync(`${__dirname}/books-simple.json`, `utf-8`),
);

const importData = async () => {
  try {
    await Book.create(books);
    console.log('Data added successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    
    //delete all data present in the collection
    await Book.deleteMany();
    console.log('Data deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};


if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv)
/* 
to run above command open two termminal 1 terminal for normal execution
like npm start and other terminal write node dev-data/data/import-dev-data.js 
*/
