const request = require("request");
const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const cron = require("node-cron");
const fs = require("fs");
const bodyParser = require("body-parser");
const axios = require("axios");
const mysql = require("mysql2/promise");
dotenv.config();
const season2 = new Date("2023-11-09T16:00:00+09:00");
const LIMIT = 5 * 60 * 1000;
const VALIDATIONCODE = "seoultech";
const production = true;

if (production) {
	const option = {
		ca: fs.readFileSync(process.env.CA),
		key: fs.readFileSync(process.env.KEY),
		cert: fs.readFileSync(process.env.CERT),
	};
	const https = require("https").createServer(option, app);
	https.listen(8080, () => {
		console.log("listening in 8080 https");
	});
} else {
	const cors = require("cors");
	app.use(cors());
	const http = require("http").createServer(app);
	http.listen(8080, () => {
		console.log("listening in 8080 http");
	});
}

app.use(express.static(path.join(__dirname, "./build")));
app.use(bodyParser.json());

const pool = mysql.createPool({
	// DB connection pool 생성
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	connectionLimit: 50,
	multipleStatements: true,
});

const options = {
	// API 옵션
	headers: {
		"Content-Type": "application/json",
		"x-api-key": process.env.BSER_API_KEY,
	},
};

async function updateRanking(season) {
	const URI = encodeURI(`https://open-api.bser.io/v1/rank/top/${season}/3`);
	const result = await axios.get(URI, options);
	const data = result.data.topRanks;
	let URIS = [];
	for (let i = 0; i < 1000; i++) {
		URIS.push(encodeURI(`https://open-api.bser.io/v1/user/stats/${data[i].userNum}/${season}`));
	}
	let sql = "delete from Ranking2;";
	let i = 0;
	let intervalID = setInterval(async () => {
		let targetURIS = URIS.slice(i * 40, (i + 1) * 40);
		let res = await Promise.all(targetURIS.map((endpoint) => axios.get(endpoint, options)));
		for (let item of res) {
			let col = item.data.userStats[0];
			sql += `insert into Ranking2 values (${col.userNum}, '${col.nickname}', ${col.rank}, ${col.mmr}, ${col.totalGames}, ${col.top1}, ${col.top3}, ${col.averageRank}, ${col.averageKills}`;
			for (let stats of col.characterStats) {
				sql += `,${stats.characterCode}, ${stats.totalGames}`;
			}
			for (let j = 0; j < 3 - col.characterStats.length; j++) {
				sql += ", null, null";
			}
			sql += ");";
		}
		i++;
		if (i >= 25) {
			sql += "update ranking_updated set updated = now() where season = 2";
			clearInterval(intervalID);
			const con = await pool.getConnection();
			const [rows] = await con.query(sql);
			console.log("complete");
			con.release();
		}
	}, 1000);
}
const task = cron.schedule(
	"0 * * * *",
	() => {
		updateRanking(21);
	},
	{ scheduled: true }
); // 랭킹 자동 갱신

app.get("/rank/:season", async (req, res) => {
	const con = await pool.getConnection();
	const season = req.params.season;
	const sql = `select * from Ranking${season} order by mmr desc, nickname`;
	const [rows] = await con.query(sql);
	const sql2 = `select updated from ranking_updated where season = ${season}`;
	const [rows2] = await con.query(sql2);
	res.send({ data: rows, updated: rows2[0].updated });
	console.log("send");
	con.release();
});

app.get("/game/:gameId", async (req, res) => {
	const gameId = req.params.gameId;
	const result = await axios.get(encodeURI(`https://open-api.bser.io/v1/games/${gameId}`), options);
	res.send(result.data);
	console.log(gameId);
});

app.post("/play", async (req, res) => {
	const nickname = req.body.nickname;
	const userNum = req.body.userNum;
	let updated = new Date(req.body.updated);
	let sql = "";
	if (req.body.updated === null) {
		updated = season2;
		sql = `insert into User values (${userNum}, '${nickname}', now());`;
	} else {
		sql = `update User set updated = now() where userNum = ${userNum};`;
	}
	let result2 = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/games/${userNum}`), options);
	let next = result2.data.next;
	let games = [];
	for (let game of result2.data.userGames) {
		if (game.matchingMode === 3 && game.gameId !== 0 && game.seasonId === 21) {
			let endTime = new Date(game.startDtm).setSeconds(game.duration);
			if (endTime > updated) {
				games.push(game);
			} else {
				next = undefined;
				break;
			}
		}
	}
	while (next !== undefined) {
		result2 = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/games/${userNum}?next=${next}`), options);
		next = result2.data.next;
		for (let game of result2.data.userGames) {
			if (game.matchingMode === 3 && game.gameId !== 0 && game.seasonId === 21) {
				if (games.length >= 20) {
					next = undefined;
					break;
				}
				let endTime = new Date(game.startDtm).setSeconds(game.duration);
				if (endTime > updated) {
					games.push(game);
				} else {
					next = undefined;
					break;
				}
			}
		}
	}
	for (let game of games) {
		sql += "insert into season2 values (";
		let data = [];
		data.push(game.userNum);
		data.push(game.gameId);
		data.push(game.characterNum);
		data.push(game.characterLevel);
		data.push(game.gameRank);
		data.push(game.playerKill);
		data.push(game.playerAssistant);
		data.push(game.monsterKill);
		data.push(game.bestWeapon);
		data.push(game.bestWeaponLevel);
		data.push(JSON.stringify(game.masteryLevel));
		data.push(JSON.stringify(game.equipment));
		data.push(game.startDtm);
		data.push(game.duration);
		data.push(game.mmrBefore);
		data.push(game.mmrGain);
		data.push(game.mmrAfter);
		data.push(game.victory);
		data.push(game.damageToPlayer);
		data.push(game.damageFromPlayer);
		data.push(game.damageToMonster);
		data.push(game.damageFromMonster);
		data.push(JSON.stringify(game.killMonsters));
		data.push(game.healAmount);
		data.push(game.teamRecover);
		data.push(game.addSurveillanceCamera);
		data.push(game.addTelephotoCamera);
		data.push(game.removeSurveillanceCamera);
		data.push(game.removeTelephotoCamera);
		data.push(game.giveUp);
		data.push(game.matchSize);
		data.push(game.teamKill);
		data.push(game.accountLevel);
		data.push(game.traitFirstCore);
		data.push(JSON.stringify(game.traitFirstSub));
		data.push(JSON.stringify(game.traitSecondSub));
		data.push(game.escapeState);
		data.push(game.tacticalSkillGroup);
		data.push(game.tacticalSkillLevel);
		data.push(game.totalGainVFCredit);
		for (let item of data) {
			if (typeof item === "string") {
				sql += `'${item}', `;
			} else {
				sql += `${item},`;
			}
		}
		sql = sql.slice(0, -1);
		sql += ");";
	}
	const con = await pool.getConnection();
	const [rows] = await con.query(sql);
	sql = `select * from season2 where userNum = ${userNum} order by gameId desc limit 0, 20`;
	const [rows2] = await con.query(sql);
	let rank;
	if (rows2.length !== 0 && rows2[0].mmrAfter >= 6000) {
		const result = await axios.get(encodeURI(`https://open-api.bser.io/v1/rank/${userNum}/21/3`), options);
		rank = result.data.userRank.rank;
		console.log(rank);
	}
	res.json({
		view: 1,
		userNum: userNum,
		games: rows2,
		updated: new Date(),
		rank: rank,
	});
	con.release();
});

app.get("/play/:nickname", async (req, res) => {
	const nickname = req.params.nickname;
	const result = await axios.get(encodeURI(`https://open-api.bser.io/v1/user/nickname?query=${nickname}`), options);
	const isValidNickname = result.data.code === 200 ? true : false;
	const userNum = isValidNickname ? result.data.user.userNum : null;
	const con = await pool.getConnection();
	let sql = `select updated from User where nickname = '${nickname}'`;
	const [rows] = await con.query(sql);
	if (rows[0] === undefined) {
		// DB에 없는 유저
		if (isValidNickname) {
			// 유효한 닉네임
			res.json({
				view: 3,
				userNum: userNum,
				games: [],
				updated: undefined,
			});
		} else {
			// 유효하지 않은 닉네임
			res.status(404).send();
		}
	} else {
		// DB에 있는 유저
		const updated = new Date(rows[0].updated);
		const now = new Date();
		sql = `select * from season2 where userNum = ${userNum} order by gameId desc limit 0, 20`;
		const [games] = await con.query(sql);
		let rank;
		if (games.length !== 0 && games[0].mmrAfter >= 6000) {
			const result = await axios.get(encodeURI(`https://open-api.bser.io/v1/rank/${userNum}/21/3`), options);
			rank = result.data.userRank.rank;
		}
		if (now - updated < LIMIT) {
			// 최근 갱신한 경우
			res.json({
				view: 1,
				userNum: userNum,
				games: games,
				updated: updated,
				rank: rank,
			});
		} else {
			// 갱신 가능
			res.json({
				view: 2,
				userNum: userNum,
				games: games,
				updated: updated,
				rank: rank,
			});
		}
	}
	con.release();
});

app.post("/member", async (req, res) => {
	// 회원가입
	let id = req.body.id;
	let password = req.body.password;
	let validation = req.body.validation;
	if (validation === VALIDATIONCODE) {
		const con = await pool.getConnection();
		let sql = `select id from member where id = '${id}'`;
		const [rows] = await con.query(sql);
		console.log(rows);
		if (rows.length === 1 && rows[0].id === id) {
			res.send("중복");
		} else {
			sql = `insert into member values ('${id}', '${password}')`;
			const [rows] = await con.query(sql);
			res.send("성공");
		}
		con.release();
	} else {
		res.send("인증 코드가 틀립니다.");
	}
});

app.post("/login", async (req, res) => {
	// 로그인
	const id = req.body.id;
	const password = req.body.password;
	let sql = `select id, password from member where id = '${id}'`;
	const con = await pool.getConnection();
	const [rows] = await con.query(sql);
	console.log(rows);
	if (rows.length === 1 && rows[0].id === id && rows[0].password === password) {
		// 로그인 성공
		res.send("성공");
	} else {
		// 로그인 실패
		res.status(404).send();
	}
});
app.post("/logout", async (req, res) => {
	// 로그아웃
});
app.delete("/member/:id", async (req, res) => {
	// 회원탈퇴
	const member_id = req.params.id;
	let sql = `delete from member where id = '${member_id}'`;
	const con = await pool.getConnection();
	const [rows] = await con.query(sql);
	res.send("회원 탈퇴");
});
app.get("/posts", async (req, res) => {
	// 모든 게시글 조회
	let sql = "select * from post";
	const con = await pool.getConnection();
	const [rows] = await con.query(sql);
	res.send(rows);
});
app.get("/posts/:id", async (req, res) => {
	// 자신의 게시글 조회
	const member_id = req.params.id;
	let sql = `select * from post where member_id = '${member_id}'`;
	const con = await pool.getConnection();
	const [rows] = await con.query(sql);
	res.send(rows);
});
app.post("/posts", async (req, res) => {
	// 게시글 등록
	const member_id = req.body.member_id;
	const title = req.body.title;
	const content = req.body.content;
	const char1 = req.body.char1;
	const char2 = req.body.char2;
	const char3 = req.body.char3;
	let sql = `insert into post(member_id, title, content, char1, char2, char3) values ('${member_id}', '${title}', '${content}', ${char1}, ${char2}, ${char3})`;
	const con = await pool.getConnection();
	const [rows] = await con.query(sql);
	console.log("게시글 등록");
	res.send("게시글 등록");
});
/* app.put('posts/:num', async (req, res) => { // 게시글 수정
    const num = req.params.num
    const title = req.body.title
    const content = req.body.content
    const char1 = req.body.char1
    const char2 = req.body.char2
    const char3 = req.body.char3
    let sql = `update post set title='${title}', content='${content}', char1=${char1}, char2=${char2}, char3=${char3} where num = ${num}`
    const con = await pool.getConnection();
    const [rows] = await con.query(sql)
    console.log('게시글 수정')
}) */
app.delete("/posts/:num", async (req, res) => {
	// 게시글 삭제
	const num = req.params.num;
	let sql = `delete from post where num = ${num}`;
	const con = await pool.getConnection();
	const [rows] = await con.query(sql);
	console.log("게시글 삭제");
	res.send("게시글 삭제");
});

app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "./build/index.html"));
});
