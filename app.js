require('dotenv').config()
const express = require('express')
const mongoose  = require('mongoose')
const app = express()
const fileRoute=require('./routes/fileRoute')
const port =process.env.PORT || 3000
// mongo connect
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("error in connecting to DB");
  });
// middlware
app.use(express.json())



app.use('/api',fileRoute)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))  
