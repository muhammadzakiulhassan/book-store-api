const express = require('express');
const morgan= require('morgan')
const app = express();
const AppError=require('./utils/appError')
const GlobalErrorHandler=require('./controllers/errorController')

app.use(express.json());
app.set('query parser', 'extended');

const bookRouter=require('./routes/bookRouter')
const userRouter=require('./routes/userRouter')

if(process.env.NODE_ENV==='development')

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


  app.use(`/api/v1/books`,bookRouter)
app.use(`/api/v1/users`,userRouter)

app.all('/{*any}',(req,res,next)=>{
next(new AppError(`cannot find ${req.originalUrl} on this server!`,404))
})

app.use(GlobalErrorHandler)
module.exports=app
