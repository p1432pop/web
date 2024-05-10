import React, { useEffect, useRef, useState } from "react";
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
import FiberNewIcon from "@mui/icons-material/FiberNew";
import AddIcon from "@mui/icons-material/Add";
import Loading from "../components/Loading";
import { getTierImg, getTierName } from "../utils/tier";

import styles from "../style/Main.module.css";

export default function Main(props) {
	const [loading, setLoading] = useState(true);
	const [drop, setDrop] = useState(false);
	const [ranking, setRanking] = useState([]);
	const [recentNickname, setRecentNickname] = useState([]);
	useEffect(() => {
		const setup = async () => {
			const result = await Api.getMainRanking();
			setLoading(false);
			setRanking(result.data);
			const value = localStorage.getItem("nickname");
			if (value) {
				setRecentNickname(JSON.parse(value));
			} else {
				localStorage.setItem("nickname", JSON.stringify([]));
			}
		};
		setup();
	}, []);
	const navigate = useNavigate();
	const nickname = useRef("");
	const patchNotes = () => {
		let arr = [];
		let Links = [
			{
				url: "https://playeternalreturn.com/posts/news/1765",
				text: "2024.02.29 - 1.16 패치노트",
			},
			{
				url: "https://playeternalreturn.com/posts/news/1749",
				text: "2024.02.22 - 1.15.1 패치노트",
			},
			{
				url: "https://playeternalreturn.com/posts/news/1727",
				text: "2024.02.15 - 1.15 패치노트",
			},
		];
		for (let i = 0; i < Links.length; i++) {
			arr.push(
				<MuiLink key={i} href={Links[i].url} underline="none" target="_blank">
					{Links[i].text}
				</MuiLink>
			);
		}
		return arr;
	};
	const removeStorage = (idx) => {
		const value = JSON.parse(localStorage.getItem("nickname"));
		value.splice(idx, 1);
		localStorage.setItem("nickname", JSON.stringify([...value]));
		setRecentNickname([...value]);
	};
	const inputBaseHandler = (ev) => {
		if (ev.key === "Enter") {
			if (ev.target.value.trim().length === 0) {
				alert("공백 없이 입력해주세요.");
			} else {
				navigate(`/players/${ev.target.value}`);
			}
		}
	};
	const buttonHandler = () => {
		if (nickname.current.value.trim().length === 0) {
			alert("공백 없이 입력해주세요.");
		} else {
			navigate(`/players/${nickname.current.value}`);
		}
	};
	const rankingButtonHandler = () => {
		navigate("/ranking");
	};
	const avatarImage = (codes) => {
		let arr = [];
		codes.forEach((code, index) => {
			if (code) {
				arr.push(<Avatar key={index} className={styles.mx} src={`image/CharacterIcon/${code}.png`} />);
			}
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
	if (loading) {
		return <Loading />;
	}
	return (
		<>
			<div className={styles.topContent}>
				<div className={styles.searchBox}>
					<InputBase className={styles.input} placeholder="플레이어 검색" onKeyDown={(ev) => inputBaseHandler(ev)} inputRef={nickname} onFocus={() => setDrop(true)} onBlur={() => setDrop(false)} />
					<IconButton type="submit" onClick={buttonHandler}>
						<SearchIcon sx={{ color: "black" }} />
					</IconButton>
				</div>
				{drop ? (
					<div className={styles.drop} onMouseDown={(event) => event.preventDefault()}>
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
				) : null}
			</div>
			<div className={styles.patchBox}>
				<Stack spacing={2}>
					<div>- 최근 패치 노트</div>
					<Stack direction="row" spacing={0.5}>
						<MuiLink href="https://playeternalreturn.com/posts/news/1792" underline="none" target="_blank">
							2024.03.14 - 1.17 패치노트
						</MuiLink>
						<FiberNewIcon style={{ height: "21px" }} />
					</Stack>
					{patchNotes()}
				</Stack>
			</div>
			<div>
				{
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
											<div className={styles.avatarBox}>
												<Avatar className={styles.mx} src={getTierImg(row.mmr, 1 + idx)} />
												{getTierName(row.mmr, 1 + idx)}
											</div>
										</StyledTableCell>
										<StyledTableCell>{row.mmr >= 6000 ? row.mmr - 6000 : row.mmr % 250}</StyledTableCell>
										<StyledTableCell>{(row.top1 * 100).toFixed(1)}%</StyledTableCell>
										<StyledTableCell>#{row.averageRank.toFixed(1)}</StyledTableCell>
										<StyledTableCell>{row.averageKills.toFixed(2)}</StyledTableCell>
										<StyledTableCell>
											<div className={styles.avatarBox}>{avatarImage([row.characterCode1, row.characterCode2, row.characterCode3])}</div>
										</StyledTableCell>
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				}
			</div>
		</>
	);
}
