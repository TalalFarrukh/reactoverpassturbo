const { Client } = require('pg')

const devConfig = {
  user: 'postgres',
  password: 'password',
  host: 'localhost',
  database: 'fiverr',
  port: 5432,
}



const client = new Client(devConfig)
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database!");
});

module.exports = client; 