import express from 'express'
import 'dotenv/config';
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  });

app.get('/', (req, res) => {
  res.send('I am up and running!')
})

