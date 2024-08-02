import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Api } from "../axios/axios";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";
import { Link as MuiLink } from "@mui/material";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Loading from "../components/Loading";
import { getTierImg, getTierName } from "../utils/tier";

import styles from "../style/Main.module.css";
import { CharacterStat, topRank } from "../axios/dto/rank/rank.dto";
import { NewsDTO } from "../axios/dto/news/news.dto";
import { JSX } from "react/jsx-runtime";
import { Card, CardContent, CardCover, Typography } from "@mui/joy";

export default function Main() {
	const [display, setDisplay] = useState("none");
	const [loading, setLoading] = useState(true);
	const [news, setNews] = useState<NewsDTO[]>([]);
	const [ranking, setRanking] = useState<topRank[]>([]);
	const [nickname, setNickname] = useState("");
	const [recentNickname, setRecentNickname] = useState<string[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const setup = async () => {
			setLoading(false);
			setRanking((await Api.getMainRanking()).topRanks);
			setNews(await Api.getMainNews());
			const value = localStorage.getItem("nickname");
			if (value) {
				setRecentNickname(JSON.parse(value));
			} else {
				localStorage.setItem("nickname", JSON.stringify([]));
			}
		};
		setup();
	}, []);

	const removeStorage = (idx: number) => {
		const nicknames = localStorage.getItem("nickname");
		if (nicknames) {
			const nicknamesArr: string[] = JSON.parse(nicknames);
			nicknamesArr.splice(idx, 1);
			localStorage.setItem("nickname", JSON.stringify([...nicknamesArr]));
			setRecentNickname([...nicknamesArr]);
		}
	};

	const keyDownHandler = (ev: React.KeyboardEvent<HTMLInputElement>) => {
		if (ev.key === "Enter") {
			buttonHandler();
		}
	};

	const inputChangeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(ev.target.value);
	};

	const buttonHandler = () => {
		if (nickname.trim().length === 0) {
			alert("공백 없이 입력해주세요.");
		} else {
			navigate(`/players/${nickname}`);
		}
	};

	const rankingButtonHandler = () => {
		navigate("/ranking");
	};

	const avatarImage = (characterStats: CharacterStat[]) => {
		let arr: JSX.Element[] = [];
		characterStats.forEach((characterStat, index) => {
			arr.push(<Avatar key={index} className={styles.mx} src={`https://lumia.kr/image/CharacterIcon/${characterStat.characterCode}.png`} />);
		});
		return arr;
	};

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white,
			textAlign: "center",
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 16,
			textAlign: "center",
		},
	}));

	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover,
		},
	}));

	if (loading) return <Loading />;

	return (
		<>
			<Card sx={{ height: "608px", "--CardCover-radius": "0px", border: "0px" }}>
				<CardCover>
					<img src="https://lumia.kr/image/background.png"></img>
				</CardCover>
				<CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
					<div className={styles.searchBox}>
						<InputBase className={styles.input} placeholder="플레이어 검색" onKeyDown={keyDownHandler} onChange={inputChangeHandler} onFocus={() => setDisplay("block")} onBlur={() => setDisplay("none")} />
						<IconButton type="submit" onClick={buttonHandler}>
							<SearchIcon sx={{ color: "black" }} />
						</IconButton>
					</div>
					<div className={styles.drop} onMouseDown={(event) => event.preventDefault()} style={{ display }}>
						<div>최근 검색</div>
						{recentNickname.map((row, idx) => (
							<div className={styles.flexBetween} key={idx}>
								<RouterLink style={{ textDecoration: "none" }} to={`/players/${row}`}>
									{row}
								</RouterLink>
								<IconButton onMouseDown={() => removeStorage(idx)}>
									<DeleteIcon />
								</IconButton>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
			<div style={{ display: "flex" }}>
				<Card sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
					<Typography fontWeight="bold">Front-End</Typography>
					<MuiLink href="https://github.com/p1432pop/web" target="_blank">
						<img alt="GitHub" src="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white" />
					</MuiLink>
					<Typography fontWeight="bold">Back-End</Typography>
					<MuiLink href="https://github.com/p1432pop/lumia-server" target="_blank">
						<img alt="GitHub" src="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white" />
					</MuiLink>
					<Typography fontWeight="bold">API-DOCS</Typography>
					<MuiLink href="http://localhost:8080/api" target="_blank">
						<img alt="GitHub" src="https://img.shields.io/badge/swagger-85EA2D.svg?&style=for-the-badge&logo=swagger&logoColor=white" />
					</MuiLink>
				</Card>
				<Card sx={{ width: "480px", height: "270px" }}>
					<CardCover>
						<iframe style={{ border: "0px" }} src="https://www.youtube.com/embed/8Y_-uXboU9E?&wmode=opaque" allowFullScreen></iframe>
					</CardCover>
				</Card>
				<Card sx={{ flex: 1 }}>
					<Stack spacing={2}>
						<Typography>최근 패치 노트</Typography>
						{news.map((note, idx) => (
							<MuiLink key={idx} href={note.url} underline="none" target="_blank">
								· {note.title}
							</MuiLink>
						))}
					</Stack>
				</Card>
			</div>
			<div>
				<TableContainer className={styles.my} component={Paper}>
					<Table>
						<caption>
							<div className={styles.flexCenter}>
								<IconButton onClick={rankingButtonHandler}>
									<AddIcon />
								</IconButton>
								더 보기
							</div>
						</caption>
						<TableHead>
							<TableRow>
								<StyledTableCell>순위</StyledTableCell>
								<StyledTableCell>플레이어</StyledTableCell>
								<StyledTableCell>티어</StyledTableCell>
								<StyledTableCell>RP</StyledTableCell>
								<StyledTableCell>승률</StyledTableCell>
								<StyledTableCell>평균 순위</StyledTableCell>
								<StyledTableCell>평균 킬</StyledTableCell>
								<StyledTableCell>모스트 실험체</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{ranking.map((row, idx) => (
								<StyledTableRow key={idx}>
									<StyledTableCell>{idx + 1}</StyledTableCell>
									<StyledTableCell>
										<RouterLink style={{ textDecoration: "none" }} to={`/players/${row.nickname}`}>
											{row.nickname}
										</RouterLink>
									</StyledTableCell>
									<StyledTableCell>
										<div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
											<Avatar className={styles.mx} src={getTierImg(row.mmr, 1 + idx)} />
											{getTierName(row.mmr, 1 + idx)}
										</div>
									</StyledTableCell>
									<StyledTableCell>{row.mmr >= 6000 ? row.mmr - 6000 : row.mmr % 250}</StyledTableCell>
									<StyledTableCell>{(row.top1 * 100).toFixed(1)}%</StyledTableCell>
									<StyledTableCell>#{row.averageRank.toFixed(1)}</StyledTableCell>
									<StyledTableCell>{row.averageKills.toFixed(2)}</StyledTableCell>
									<StyledTableCell>
										<div className={styles.avatarBox}>{avatarImage(row.characterStats)}</div>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</>
	);
}
