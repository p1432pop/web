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
const URL = encodeURI('https://open-api.bser.io/v1/user/stats/661111/21');
const URL2 = encodeURI('https://open-api.bser.io/v1/user/stats/1553415/19');
const URL3 = encodeURI('https://open-api.bser.io/v2/data/3046038497');

const mysql = require('mysql2');
const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 50,
    multipleStatements: true
})

const options = {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.BSER_API_KEY
    }
}
const q = async () => {
    await axios.all([axios.get(URL3, options), axios.get(URL2, options)]).then(
        axios.spread((res1) => {
            //console.log(res1.data.userStats[0].characterStats[0])
            console.log(res1.data)
            /*for(let i=0; i<10; i++) {
                console.log(res1.data.topRanks[i])
            }*/
        })
    )
}
async function getRanking(season) {
    const URI = encodeURI(`https://open-api.bser.io/v1/rank/top/${season}/3`);
    await axios.get(URI, options).then((result) => {
        pool.getConnection((err, con) => {
            if (err) throw err;
            else {
                let data = result.data.topRanks;
                let URIS = [];
                for (let i=0; i<1000; i++) {
                    URIS.push(encodeURI(`https://open-api.bser.io/v1/user/stats/${data[i].userNum}/${season}`))
                }
                let currentUriIndex = 0;
                let sql = ''
                let intervalID = setInterval(async () => {
                    let targetURIS = URIS.slice(currentUriIndex*40, (currentUriIndex+1)*40)
                    await axios.all(targetURIS.map((endpoint) => axios.get(endpoint, options))).then(
                        axios.spread((...res) => {
                            for(let item of res) {
                                let col = item.data.userStats[0]
                                sql+=`insert into Ranking2 values (${col.userNum}, '${col.nickname}', ${col.rank}, ${col.mmr}, ${col.totalGames}, ${col.top1}, ${col.top3}, ${col.averageRank}, ${col.averageKills}`
                                for(let stats of col.characterStats) {
                                    sql+= `,${stats.characterCode}, ${stats.totalGames}`
                                }
                                for(let i=0; i<3-col.characterStats.length; i++) {
                                    sql+= ', null, null';
                                }
                                sql+=');'
                            }
                            currentUriIndex++;
                            console.log(currentUriIndex)
                            console.log(sql)
                            if (currentUriIndex>=25) {
                                clearInterval(intervalID)
                                con.query(sql, function(err, rows, fields) {
                                    con.release()
                                    console.log(sql)
                                    console.log(err)
                                })
                            }
                        })
                    )
                }, 2000)
            }
        })
    })
}
//getRanking(21);
const task = cron.schedule("40 12 * * * *", async () => { // 랭킹 정보 갱신
    console.log(1);
    await axios.get(URL3, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.BSER_API_KEY
        }
    }).then((result) => {
        pool.getConnection(async (err, con) => {
            if (err) {
                throw err;
            }
            else {
                let data = result.data.topRanks;
                let URLS = [];
                for (let i=120; i<160; i++) {
                    URLS.push(encodeURI(`https://open-api.bser.io/v1/user/stats/${data[i].userNum}/19`))
                }
                await axios.all(URLS.map((endpoint) => axios.get(endpoint, options))).then(
                    axios.spread((...res1) => {
                        //console.log(res1.data.userStats[0].characterStats[0])
                        let sql = ''
                        for(let item of res1) {
                            let col = item.data.userStats[0]
                            sql+=`insert into Ranking1 values (${col.userNum}, '${col.nickname}', ${col.rank}, ${col.mmr}, ${col.totalGames}, ${col.top1}, ${col.top3}, ${col.averageRank}, ${col.averageKills}`
                            console.log(item.data.userStats[0])
                            for(let stats of col.characterStats) {
                                sql+= `,${stats.characterCode}, ${stats.totalGames}`
                            }
                            for(let i=0; i<3-col.characterStats.length; i++) {
                                sql+= ', null, null';
                            }
                            sql+=');'
                        }
                        con.query(sql, function(err, rows, fields) {
                            con.release()
                            console.log(sql)
                            console.log(err)
                        })
                    })
                )
                /*for (let item of data) {
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
                });*/
            }
        });
    })
}, {scheduled: false})

app.get('/rank/:season', (req, res) => {
    pool.getConnection((err, con) => {
        if (err) throw err;
        else {
            let season = req.params.season
            let sql = `select * from Ranking${season} order by mmr desc, nickname`
            con.query(sql, function(err, rows, fields) {
                res.send(rows);
                console.log('send')
                con.release();
            })
        }
    })
})

app.get('*', function(req, res){
    res.sendFile( path.join(__dirname, './build/index.html') )
});
