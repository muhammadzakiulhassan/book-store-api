const express = require('express');
const morgan= require('morgan')
const app = express();

app.use(express.json());
app.set('query parser', 'extended');

const bookRouter=require('./routes/bookRouter')
const userRouter=require('./routes/userRouter')

if(process.env.NODE_ENV==='development')

// This middleWare work on any Route:
app.use((req, res, next) => {
  console.log('Test MiddleWare');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

  app.use(`/api/v1/books`,bookRouter)
app.use(`/api/v1/users`,userRouter)

module.exports=app
