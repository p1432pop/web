const request = require('request');
const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const cron = require('node-cron');
const fs = require('fs');
dotenv.config();
const production = false;
const season2 = new Date("2023-11-09T16:00:00+09:00")
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
            let updated = new Date(rows[0])
            let now = new Date()
            if (now - updated <= 5*60*1000) { // 최근 갱신한 기록이 있는 경우
                
            }
            else {

            }
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
        con.release()
    }
    else { // 유효하지 않은 닉네임
        console.log("유효하지 않은 닉네임")
    }
}
//q("한동그라미")

async function updateRanking(season) {
    const URI = encodeURI(`https://open-api.bser.io/v1/rank/top/${season}/3`);
    const result = await axios.get(URI, options)
    const data = result.data.topRanks;
    let URIS = [];
    for (let i=0; i<1000; i++) {
        URIS.push(encodeURI(`https://open-api.bser.io/v1/user/stats/${data[i].userNum}/${season}`))
    }
    let sql = ''
    let i = 0
    let intervalID = setInterval(async () => {
        let targetURIS = URIS.slice(i*40, (i+1)*40)
        let res = await Promise.all(targetURIS.map((endpoint) => axios.get(endpoint, options)))
        for (let item of res) {
            let col = item.data.userStats[0];
            sql+=`insert into Ranking2 values (${col.userNum}, '${col.nickname}', ${col.rank}, ${col.mmr}, ${col.totalGames}, ${col.top1}, ${col.top3}, ${col.averageRank}, ${col.averageKills}`
            for(let stats of col.characterStats) {
                sql+= `,${stats.characterCode}, ${stats.totalGames}`
            }
            for(let j=0; j<3-col.characterStats.length; j++) {
                sql+= ', null, null';
            }
            sql+=');'
        }
        i++
        if (i>=25) {
            console.log(sql)
            clearInterval(intervalID)
            const con = await pool.getConnection();
            const [err, rows] = await con.query(sql)
            console.log(err)
            con.release()
        }
    }, 1000)
}
//updateRanking(21);
const task = cron.schedule("40 12 * * * *", () => {updateRanking(21)}, {scheduled: false})

app.get('/rank/:season', async (req, res) => {
    const con = await pool.getConnection();
    const season = req.params.season
    const sql = `select * from Ranking${season} order by mmr desc, nickname`
    const [rows] = await con.query(sql);
    res.send(rows);
    console.log('send')
    con.release()
})

app.get('/game/:gameId', async (req, res) => {
    const gameId = req.params.gameId;
    const con = await pool.getConnection();
    let sql = `select * from season2 where gameId = ${gameId}`;
    const [rows] = await con.query(sql)
    res.send(rows)
    con.release()
})
app.get('/play/:nickname', async (req, res) => {
    const nickname = req.params.nickname;
    const con = await pool.getConnection();
    let sql = `select updated from User where nickname = '${nickname}'`;
    const [rows] = await con.query(sql)
    const result = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/nickname?query=${nickname}`), options)
    if (rows[0] === undefined) { // DB에 없는 유저
        if (result.data.code === 200) { // 유효한 닉네임
            res.status(204).send();
            console.log(204)
        }
        else {
            res.status(404).send();
            console.log(404)
        }
    }
    else { // DB에 있는 유저
        const updated = new Date(rows[0].updated)
        const now = new Date()
        const userNum = result.data.user.userNum
        sql = `select * from season2 where userNum = ${userNum} order by gameId desc`
        const [rows2] = await con.query(sql)
        if (now - updated < 5*60*1000) { // 최근 갱신한 경우
            res.json({
                state: false,
                data: rows2,
                updated: updated
            })
        }
        else { // 갱신 가능
            res.json({
                state: true,
                data: rows2,
                updated: updated
            })
        }   
    }
    con.release()
})
app.get('*', function(req, res){
    res.sendFile( path.join(__dirname, './build/index.html') )
});
