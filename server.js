const request = require('request');
const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const http = require('http').createServer(app);
http.listen(8080, function(){
    console.log('listening in 8080');
});

app.use(express.static(path.join(__dirname, './build')));

const axios = require('axios');
const URL = encodeURI('https://open-api.bser.io/v1/rank/top/19/3');

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const q = async () => {
    await axios.get(URL, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.BSER_API_KEY
        }
    }).then((result) => {
        res.send(result.data.topRanks[0])
        connection.connect((err) => {
            if (err) {
                throw err;
            } 
            else {
                let sql = "insert into Ranking values"
                connection.query("(usernum, nickname, ranking, id)", function(err, rows, fields) {
                    console.log(rows);
                });
            }
        });
    });
}

q();

app.get('/rank', async (req, res) => {
    console.log(1);
    await axios.get(URL, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.BSER_API_KEY
        }
    }).then((result) => {res.send(result.data.topRanks[0])});
})

app.get('*', function(req, res){
    res.sendFile( path.join(__dirname, './build/index.html') )
});
