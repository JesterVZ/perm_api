const mysql = require('mysql2');
const express = require("express");
const app = express();
var cors = require('cors')

app.use(cors())

const connection = mysql.createConnection({
  port: '3303',
  host: '178.253.40.144',
  user: 'root',
  password: '112233',
  database: 'perm_dp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});




app.get('/question', (req, res) => {
    connection.query('SELECT * FROM questions', (err, results) => {
      if (err) {
        console.error('Error fetching question: ' + err.stack);
        res.status(500).send('Error fetching question');
        return;
      }
      const question = results;
      connection.query('SELECT * FROM answers', (err, results) => {
        if (err) {
          res.status(500).send('Error fetching answers');
          return;
        }
        const answers = results;
        res.json({
          'questions': question,
          'answers': answers
        });
      });
      
    });
  });

  app.listen(3000);