const mysql = require('mysql2');
const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      port: '3303',
      host: '178.253.40.144',
      user: 'root',
      password: '112233',
      database: 'perm_dp'
    });
    this.makeConnection();
  }

  makeConnection() {
    this.connection.connect((err) => {
      if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
      }
      console.log('Connected to database as id ' + this.connection.threadId);
    });
  }

  closeConnection(){
    this.connection.destroy();
  }

  getQuestionsAndAnswers(req, res) {
    try {
      this.connection.query('SELECT * FROM questions', (err, questionResults) => {
        if (err) {
          console.error('Error fetching questions: ' + err.stack);
          res.status(500).send('Error fetching questions');
          return;
        }
        const questions = questionResults;
        
        this.connection.query('SELECT * FROM answers', (err, answerResults) => {
          if (err) {
            res.status(500).send('Error fetching answers');
            return;
          }
          const answers = answerResults;
          res.json({
            'questions': questions,
            'answers': answers
          });
        });
        this.closeConnection()
        console.log('connection is closed');
      });
    } catch (e) {
      this.makeConnection();
    }
  }
}



app.get('/question', (req, res) => {
  const db = new Database();
  db.getQuestionsAndAnswers(req, res);
});

app.listen(3000);
