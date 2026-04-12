const fs = require('fs');


const books = JSON.parse(
  fs.readFileSync(`${__dirname}/../book-list/data.json`, `utf-8`),
);

exports.checkID=((req,res,next,val)=>{
  console.log(`book id is ${val}`)
  if (req.params.id * 1 > books.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
})

exports.checkBody=((req,res,next)=>{

  if(!req.body.title||!req.body.Author){
    return res.status(400).json({
      status:'fail',
      message:'missing Author or title'
    })

  }
  next();
})

exports. getAllBooks = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedTimeat: req.requestTime,
    result: books.length,
    data: {
      books,
    },
  });
};

exports. getBook = (req, res) => {
  console.log(req.params);

  // convert id into number
  const id = req.params.id * 1;

  const book = books.find((el) => el.id === id);

 
  res.status(200).json({
    status: 'success',
    // result: book.length,
    data: {
      book,
    },
  });
};

exports. createBook = (req, res) => {
  // console.log(req.body);
  const newId = books[books.length - 1].id + 1;
  const newBook = Object.assign({ id: newId }, req.body);
  books.push(newBook);
  fs.writeFile(
    `${__dirname}/book-list/data.json`,
    JSON.stringify(books),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          books: newBook,
        },
      });
    },
  );
};

exports. updateBook = (req, res) => {

  res.status(200).json({
    status: 'success',
    data: {
      books: '<sucessfully updated....>',
    },
  });
};

exports. deleteBook = (req, res) => {

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
