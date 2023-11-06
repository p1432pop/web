const request = require('request');
const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const cron = require('node-cron')
dotenv.config();

const http = require('http').createServer(app);
http.listen(8080, function(){
    console.log('listening in 8080');
});

app.use(express.static(path.join(__dirname, './build')));

const axios = require('axios');
const URL = encodeURI('https://open-api.bser.io/v1/rank/top/19/3');

const mysql = require('mysql2');
const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 50,
    multipleStatements: true
})

const task = cron.schedule("0 * * * *", async () => { // 랭킹 정보 갱신
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
                            sql2+= `insert into Ranking values (${data[idx].userNum}, ${data[idx].rank}, ${data[idx].mmr});`
                        }
                        else {
                            sql2+= `insert into User values (${data[idx].userNum}, '${data[idx].nickname}');`
                            sql2+= `insert into Ranking values (${data[idx].userNum}, ${data[idx].rank}, ${data[idx].mmr});`
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

app.get('/rank/:id', (req, res) => {
    const id = req.params.id;
    if(id>=1 && id<=10) { // 정상적인 주소로 접근
        pool.getConnection((err, con) => {
            if (err) throw err;
            else {
                let sql = 'select * from Ranking inner join User on Ranking.userNum = User.userNum order by Ranking.ranking'
                con.query(sql, function(err, rows, fields) {
                    res.send(rows);
                    con.release();
                })
            }
        })
    }
    else { // 예외 처리
        
    }
})

app.get('*', function(req, res){
    res.sendFile( path.join(__dirname, './build/index.html') )
});
