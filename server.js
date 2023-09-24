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

const abc = async () => {
    await axios.get(URL, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.BSER_API_KEY
        }
    }).then((result) => {console.log(result.data.topRanks[0])});
};
abc();
app.get('*', function(req, res){
    res.sendFile( path.join(__dirname, './build/index.html') )
});
