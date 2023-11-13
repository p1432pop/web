const request = require('request');
const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const cron = require('node-cron');
const fs = require('fs');
dotenv.config();

const production = false;

if (production) {
    const option = {
        ca: fs.readFileSync(process.env.CA),
        key: fs.readFileSync(process.env.KEY),
        cert: fs.readFileSync(process.env.CERT)
    };
    const https = require('https').createServer(option, app);
    https.listen(8080, () => {
        console.log('listening in 8080 https');
    });
}
else {
    const http = require('http').createServer(app);
    http.listen(8080, () => {
        console.log('listening in 8080 http');
    })
}

app.use(express.static(path.join(__dirname, './build')));

const axios = require('axios');
const URL = encodeURI('https://open-api.bser.io/v1/rank/top/21/3');

const mysql = require('mysql2');
const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 50,
    multipleStatements: true
})

const task = cron.schedule("32 * * * *", async () => { // 랭킹 정보 갱신
    console.log(1);
    await axios.get(URL, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.BSER_API_KEY
        }
    }).then((result) => {
        pool.getConnection((err, con) => {
            if (err) {
                throw err;
            }
            else {
                let data = result.data.topRanks;
                let sql = ''
                for (let item of data) {
                    sql += `select exists (select * from User where userNum = ${item.userNum}) as result;`
                }
                con.query(sql, function(err, rows, fields) {
                    let sql2 = ''
                    for (let idx in rows) {
                        if (rows[idx][0].result === 1) {
                            // 해당 유저 정보 업데이트
                            sql2+= `insert into Ranking2 values (${data[idx].userNum}, ${data[idx].rank}, ${data[idx].mmr});`
                        }
                        else {
                            sql2+= `insert into User values (${data[idx].userNum}, '${data[idx].nickname}');`
                            sql2+= `insert into Ranking2 values (${data[idx].userNum}, ${data[idx].rank}, ${data[idx].mmr});`
                        }
                    }
                    con.query(sql2, function(err, rows, fields) {
                        con.release();
                        console.log(sql2)
                        console.log(err)
                    })
                });
            }
        });
    })
}, {scheduled: false})

app.get('/rank/:season', (req, res) => {
    pool.getConnection((err, con) => {
        if (err) throw err;
        else {
            let season = req.params.season
            let sql = `select * from Ranking${season} inner join User on Ranking${season}.userNum = User.userNum order by Ranking${season}.ranking`
            con.query(sql, function(err, rows, fields) {
                res.send(rows);
                con.release();
            })
        }
    })
})

app.get('*', function(req, res){
    res.sendFile( path.join(__dirname, './build/index.html') )
});
