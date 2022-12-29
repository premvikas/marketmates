const { Pool, Client } = require('pg');


//local
// const client = new Client({
//     user: 'test',
//     host: 'localhost',
//     database: 'marketmates',
//     password: "test",
//     port: 5432,
//   });

  //RDS
  const client = new Client({
    user: 'postgres',
    host: 'marketmates-1.cnr31yczanj8.ap-south-1.rds.amazonaws.com',
    database: 'marketmates-DB',
    password: "12345678",
    port: 5432,
  });

export default client;