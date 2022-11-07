const { Pool, Client } = require('pg');


//local
// const client = new Client({
//     user: 'test',
//     host: 'localhost',
//     database: 'hybr1d',
//     password: "test",
//     port: 5432,
//   });

  //RDS
  const client = new Client({
    user: 'postgres',
    host: 'hybr1d-1.cnr31yczanj8.ap-south-1.rds.amazonaws.com',
    database: 'hybr1d-DB',
    password: "12345678",
    port: 5432,
  });

export default client;