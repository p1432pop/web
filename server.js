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
const LIMIT = 5*60*1000;
const VALIDATIONCODE = "seoultech"
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
        
    }
    con.release()
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
    let sql = 'delete from Ranking2;'
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
            const [rows] = await con.query(sql)
            con.release()
        }
    }, 1000)
}
//updateRanking(21);
const task = cron.schedule("50 17 * * * *", () => {updateRanking(21)}, {scheduled: false})
app.get('/user/:id/:password')
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

//const cors = require('cors');
const bodyParser = require('body-parser')
app.use(bodyParser.json())
//app.use(cors());

app.post('/play', async (req, res) => {
    console.log(req.body)
    const nickname = req.body.nickname;
    const userNum = req.body.userNum;
    let updated = new Date(req.body.updated);
    let sql = ''
    if (req.body.updated === undefined) {
        updated = season2
        sql = `insert into User values (${userNum}, '${nickname}', now());`;
    }
    else {
        sql = `update User set updated = now() where userNum = ${userNum};`
    }
    const con = await pool.getConnection();
    let result2 = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/games/${userNum}`), options)
    let next = result2.data.next
    let games = []
    for (let game of result2.data.userGames) {
        if (game.matchingMode === 3 && game.gameId !==0 && game.seasonId === 21) {
            let endTime = new Date(game.startDtm).setSeconds(game.duration)
            if (endTime > updated) {
                games.push(game)
            }
            else {
                next = undefined
                break
            }
        }
    }
    while (next !== undefined) {
        result2 = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/games/${userNum}?next=${next}`), options)
        if(result2.data.next === undefined) {
            console.log(next)
        }
        next = result2.data.next
        for (let game of result2.data.userGames) {
            if (game.matchingMode === 3 && game.gameId !==0 && game.seasonId === 21) {
                let endTime = new Date(game.startDtm).setSeconds(game.duration)
                if (endTime > updated) {
                    games.push(game)
                }
                else {
                    next = undefined
                    break
                }
            }
        }
    }
    for (let game of games) {
        sql+="insert into season2 values ("
        let data = []
        data.push(game.userNum)
        data.push(game.gameId)
        data.push(game.characterNum)
        data.push(game.characterLevel)
        data.push(game.gameRank)
        data.push(game.playerKill)
        data.push(game.playerAssistant)
        data.push(game.monsterKill)
        data.push(game.bestWeapon)
        data.push(game.bestWeaponLevel)
        data.push(JSON.stringify(game.masteryLevel))
        data.push(JSON.stringify(game.equipment))
        data.push(game.startDtm)
        data.push(game.duration)
        data.push(game.mmrBefore)
        data.push(game.mmrGain)
        data.push(game.mmrAfter)
        data.push(game.victory)
        data.push(game.damageToPlayer)
        data.push(game.damageFromPlayer)
        data.push(game.damageToMonster)
        data.push(game.damageFromMonster)
        data.push(JSON.stringify(game.killMonsters))
        data.push(game.healAmount)
        data.push(game.teamRecover)
        data.push(game.addSurveillanceCamera)
        data.push(game.addTelephotoCamera)
        data.push(game.removeSurveillanceCamera)
        data.push(game.removeTelephotoCamera)
        data.push(game.giveUp)
        data.push(game.matchSize)
        data.push(game.teamKill)
        data.push(game.accountLevel)
        data.push(game.traitFirstCore)
        data.push(JSON.stringify(game.traitFirstSub))
        data.push(JSON.stringify(game.traitSecondSub))
        data.push(game.escapeState)
        data.push(game.tacticalSkillGroup)
        data.push(game.tacticalSkillLevel)
        data.push(game.totalGainVFCredit)
        for (let item of data) {
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
    const [rows] = await con.query(sql)
    sql = `select * from season2 where userNum = ${userNum} order by gameId desc`
    const [rows2] = await con.query(sql)
    let rank;
    if (rows2[0].mmrAfter >= 6000) {
        const result = await axios.get(encodeURI(`https://open-api.bser.io/v1/rank/${userNum}/21/3`), options)
        rank = result.data.userRank.rank
        console.log(rank)
    }
    res.json({
        view: 1,
        userNum: userNum,
        games: rows2,
        updated: new Date(),
        rank: rank
    })
    con.release()
})

app.get('/play/:nickname', async (req, res) => {
    const nickname = req.params.nickname;
    const result = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/nickname?query=${nickname}`), options)
    const isValidNickname = result.data.code === 200 ? true : false;
    const userNum = isValidNickname ? result.data.user.userNum : null;
    const con = await pool.getConnection();
    let sql = `select updated from User where nickname = '${nickname}'`;
    const [rows] = await con.query(sql)
    if (rows[0] === undefined) { // DB에 없는 유저
        if (isValidNickname) { // 유효한 닉네임
            res.json({
                view: 3,
                userNum: userNum,
                games: [],
                updated: undefined
            })
        }
        else { // 유효하지 않은 닉네임
            res.status(404).send();
        }
    }
    else { // DB에 있는 유저
        const updated = new Date(rows[0].updated)
        const now = new Date()
        sql = `select * from season2 where userNum = ${userNum} order by gameId desc`
        const [games] = await con.query(sql)
        let rank;
        if (games[0].mmrAfter >= 6000) {
            const result = await axios.get(encodeURI(`https://open-api.bser.io/v1/rank/${userNum}/21/3`), options)
            rank = result.data.userRank.rank
        }
        if (now - updated < LIMIT) { // 최근 갱신한 경우
            res.json({
                view: 1,
                userNum: userNum,
                games: games,
                updated: updated,
                rank: rank
            })
        }
        else { // 갱신 가능
            res.json({
                view: 2,
                userNum: userNum,
                games: games,
                updated: updated,
                rank: rank
            })
        }   
    }
    con.release()
})

app.post('/member', async (req, res) => { // 회원가입
    let id = req.body.id;
    let password = req.body.password;
    let validation = req.body.validation;
    if (validation === VALIDATIONCODE) {
        const con = await pool.getConnection();
        let sql = `select id from member where userid = ${id}`
        const [rows] = await con.query(sql)
        if (rows[0].id === id) {
            res.send("중복");
        }
        else {
            sql = `insert into member values (${id}, ${password})`
            const [rows] = await con.query(sql)
            res.send("성공");
        }
        con.release()
    }
    else {
        res.send("인증 코드가 틀립니다.")
    }
})

app.post('/login', async (req, res) => { // 로그인
    const id = req.body.id;
    const password = req.body.password;
    let sql = `select id, password from member where id = ${id}`
    const con = await pool.getConnection();
    const [rows] = await con.query(sql)
    if (rows[0].id === id && rows[0].password === password) { // 로그인 성공
        
    }
    else { // 로그인 실패

    }
})
app.post('/logout', async (req, res) => { // 로그아웃
    
})
app.delete('/member', async (req, res) => { // 회원탈퇴
    let id = req.body.id;
})

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, './build/index.html'))
});
