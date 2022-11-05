import express from 'express'
import 'dotenv/config';
const cors = require('cors')

import client  from '../src/configs/database';

const app = express();
app.use(express.json());
app.use(cors());

client.connect((err: any) => { 
  if (err) {
  console.log("err->", err);
  } else {
  console.log("DB ConnectedS");}
});

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  });

const authRouter  =  require("./routes/authRouter");
const sellerRouter = require("./routes/sellerRouter");
const buyerRouter = require("./routes/buyerRouter");

app.use("/user",  authRouter);
app.use("/seller",  sellerRouter);
app.use("/buyer", buyerRouter);


app.get('/', (req, res) => {
  res.send('I am up and running!')
})

