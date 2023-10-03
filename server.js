const request = require('request');
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const http = require('http').createServer(app);
http.listen(8080, function(){
    console.log('listening in 8080');
});

app.use(express.static(path.join(__dirname, './build')));

const axios = require('axios');
const URL = encodeURI('https://open-api.bser.io/v1/rank/top/19/3');

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host : 'localhost',
    user : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'test'
})
connection.connect();
connection.query('select * from 메뉴', (error, rows, fields) => {
    if (error) throw error;
    console.log(rows);
})

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
