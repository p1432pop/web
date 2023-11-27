const request = require('request');
const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const cron = require('node-cron');
const fs = require('fs');
dotenv.config();
const production = false;
const season2 = "2023-11-09-16-00-00"
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
const URL3 = encodeURI('https://open-api.bser.io/v1/user/games/1128103?next=27190093');

const mysql = require('mysql2/promise');
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
const q = async (nickname) => {
    const result = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/nickname?query=${nickname}`), options) //존재하는 닉네임인지 API 서버에 확인
    if (result.data.code === 200) { // 유효한 닉네임
        const userNum = result.data.user.userNum;
        const con = await pool.getConnection();
        let sql = `select updated from User where userNum = ${userNum}`;
        let [rows] = await con.query(sql);
        if (rows[0] === undefined) { // DB에 없는 유저인 경우
            sql = `insert into User values (${userNum}, '${nickname}', now())`;
            const result2 = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/games/${userNum}`), options)
            let next = result2.data.next
            console.log(next)
        }
        else { // DB에 있는 유저인 경우
            let result2 = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/games/${userNum}`), options)
            let next = result2.data.next
            let gameIds = []
            for (let game of result2.data.userGames) {
                if (game.matchingMode === 3 && game.gameId !==0) {
                    gameIds.push(game.gameId)
                }
            }
            while (next !== undefined) {
                result2 = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/games/${userNum}?next=${next}`), options)
                if(result2.data.next === undefined) {
                    console.log(next)
                }
                next = result2.data.next
                for (let game of result2.data.userGames) {
                    if (game.matchingMode === 3 && game.gameId !==0) {
                        gameIds.push(game.gameId)
                    }
                }
            }
            let URIS = [];
            for (let gameId of gameIds) {
                URIS.push(encodeURI(`https://open-api.bser.io/v1/games/${gameId}`))
            }
            console.log(URIS)
            let lastIndex = parseInt((URIS.length-1) / 40) + 1;
            let sql = []
            console.log(URIS.length)
            console.log(new Date())
            for (let i=0; i<lastIndex; i++) {
                let targetURIS = URIS.slice(i*40, (i+1)*40)
                await axios.all(targetURIS.map((endpoint) => axios.get(endpoint, options))).then(
                    axios.spread((...res) => {
                        res.forEach((item, index) => {
                            item.data.userGames.forEach((data) => {
                                let sql2 = ''
                                sql2 += "insert into season2 values ("
                                let abc = []
                                abc.push(data.userNum)
                                abc.push(data.gameId)
                                abc.push(data.characterNum)
                                abc.push(data.characterLevel)
                                abc.push(data.gameRank)
                                abc.push(data.playerKill)
                                abc.push(data.playerAssistant)
                                abc.push(data.monsterKill)
                                abc.push(data.bestWeapon)
                                abc.push(data.bestWeaponLevel)
                                abc.push(JSON.stringify(data.masteryLevel))
                                abc.push(JSON.stringify(data.equipment))
                                abc.push(data.startDtm)
                                abc.push(data.duration)
                                abc.push(data.mmrBefore)
                                abc.push(data.mmrGain)
                                abc.push(data.mmrAfter)
                                abc.push(data.victory)
                                abc.push(data.damageToPlayer)
                                abc.push(data.damageFromPlayer)
                                abc.push(data.damageToMonster)
                                abc.push(data.damageFromMonster)
                                abc.push(JSON.stringify(data.killMonsters))
                                abc.push(data.healAmount)
                                abc.push(data.teamRecover)
                                abc.push(data.addSurveillanceCamera)
                                abc.push(data.addTelephotoCamera)
                                abc.push(data.removeSurveillanceCamera)
                                abc.push(data.removeTelephotoCamera)
                                abc.push(data.giveUp)
                                abc.push(data.matchSize)
                                abc.push(data.teamKill)
                                abc.push(data.accountLevel)
                                abc.push(data.traitFirstCore)
                                abc.push(JSON.stringify(data.traitFirstSub))
                                abc.push(JSON.stringify(data.traitSecondSub))
                                abc.push(data.escapeState)
                                abc.push(data.tacticalSkillGroup)
                                abc.push(data.tacticalSkillLevel)
                                abc.push(data.totalGainVFCredit)
                                for (let it of abc) {
                                    if (typeof it === "string") {
                                        sql2+=`'${it}', `
                                    }
                                    else {
                                        sql2+=`${it},`
                                    }
                                }
                                sql2 = sql2.slice(0, -1);
                                sql2+=');'
                                if (sql2.includes('undefined')) {
                                    console.log(data.gameId, data.userNum, index)
                                }
                                sql.push(sql2)
                            })
                        })
                        console.log(new Date());
                        console.log(res.length);
                    })
                )
            }
            let sql2 = ''
            sql.forEach((item) => sql2+=item)
            const [err, rows] = await con.query(sql2)
            console.log(err, rows)
        }
        console.log('end')
        con.release()
    }
    else { // 유효하지 않은 닉네임
        console.log("유효하지 않은 닉네임")
    }
    /*await axios.all([axios.get(URL3, options), axios.get(URL2, options)]).then(
        axios.spread((res1) => {
            console.log(res1.data.next)
            let sql = ''
            for(let data of res1.data.userGames) {
                sql += "insert into season2 values ("
                let abc = []
                abc.push(data.userNum)
                abc.push(data.gameId)
                abc.push(data.characterNum)
                abc.push(data.characterLevel)
                abc.push(data.gameRank)
                abc.push(data.playerKill)
                abc.push(data.playerAssistant)
                abc.push(data.monsterKill)
                abc.push(data.bestWeapon)
                abc.push(data.bestWeaponLevel)
                abc.push(JSON.stringify(data.masteryLevel))
                abc.push(JSON.stringify(data.equipment))
                abc.push(data.startDtm)
                abc.push(data.duration)
                abc.push(data.mmrBefore)
                abc.push(data.mmrGain)
                abc.push(data.mmrAfter)
                abc.push(data.victory)
                abc.push(data.damageToPlayer)
                abc.push(data.damageFromPlayer)
                abc.push(data.damageToMonster)
                abc.push(data.damageFromMonster)
                abc.push(JSON.stringify(data.killMonsters))
                abc.push(data.healAmount)
                abc.push(data.teamRecover)
                abc.push(data.addSurveillanceCamera)
                abc.push(data.addTelephotoCamera)
                abc.push(data.removeSurveillanceCamera)
                abc.push(data.removeTelephotoCamera)
                abc.push(data.giveUp)
                abc.push(data.matchSize)
                abc.push(data.teamKill)
                abc.push(data.accountLevel)
                abc.push(data.traitFirstCore)
                abc.push(JSON.stringify(data.traitFirstSub))
                abc.push(JSON.stringify(data.traitSecondSub))
                abc.push(data.escapeState)
                abc.push(data.tacticalSkillGroup)
                abc.push(data.tacticalSkillLevel)
                abc.push(data.totalGainVFCredit)
                for (let item of abc) {
                    if (typeof item === "string") {
                        sql+=`'${item}', `
                    }
                    else {
                        sql+=`${item},`
                    }
                }
                sql = sql.slice(0, -1);
                sql+=');'
            }
            pool.getConnection((err, con) => {
                if (err) throw err;
                else {
                    con.query(sql, function(err, rows, fields) {
                        con.release()
                        console.log(sql)
                        console.log(err)
                    })
                }
            })
        })
    )*/
}
q("한동그라미");
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

app.get('/play/:nickname', (req, res) => {
    let nickname = req.params.season
    console.log(nickname)
    pool.getConnection((err, con) => {
        if (err) throw err;
        else {
            let userNum = 862271;
            let sql = `select * from season2 where userNum = ${userNum}`;
            con.query(sql, function(Err, rows, fields) {
                res.send(rows);
                console.log('send');
                con.release();
            })
        }
    })
})
app.get('*', function(req, res){
    res.sendFile( path.join(__dirname, './build/index.html') )
});
