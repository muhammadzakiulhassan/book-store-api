const mongoose = require('mongoose');
const dotenv=require('dotenv')
dotenv.config({path:`./config.env`})
process.on('uncaughtException',(err)=>{
  console.log('UNCAUGHT EXCEPTION!💥 SHUTTING DOWN')
    console.log('start💥💥💥',err.name,err.message,' END💥💥💥')
    process.exit(1)

})
const app=require('./app')

const DB=process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
)
console.log(process.env.DATABASE)
console.log('FINAL URL:', DB)
mongoose
.connect(DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false
}).then(()=>console.log('DB connection successful!'))

// .then(con=>{
//   console.log(con.connections);
//   console.log('DB connection successful')
// })
// .catch(err => {
//   console.log('❌ DB ERROR:', err.message);
// });

// objective 1: to create the model in moongoose(like apply crud operations)

// console.log(app.get('env'))
// console.log(process.env);
const port = 3000;
const server =app.listen(port, () => {
  console.log(`server is listen on ${port}....`);
});

process.on('unhandledRejection',(err)=>{
  console.log('UNHANDLER REJECTION!💥 SHUTTING DOWN')
  console.log('start💥💥💥',err.name,err.message,' END💥💥💥')
  server.close(()=>{
    process.exit(1)
  })
})


