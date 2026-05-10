const mongoose = require('mongoose');
const dotenv=require('dotenv')
dotenv.config({path:`./config.env`})
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
app.listen(port, () => {
  console.log(`server is listen on ${port}....`);
});
