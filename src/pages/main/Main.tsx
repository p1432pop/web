import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Api } from "../../axios/axios";
import { Box, Link as MuiLink, Paper, Table, TableContainer, TableBody, TableHead, TableRow, Stack, IconButton, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Loading from "../../components/Loading";
import { getTierImg, getTierName } from "../../utils/tier";
import { topRank } from "../../axios/dto/rank/rank.dto";
import { NewsDTO } from "../../axios/dto/news/news.dto";
import { Card, CardContent, CardCover, Typography } from "@mui/joy";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import { BorderAvatar, MostCharacterImages } from "../../components/MostCharacterIcon";
import { TierBox } from "../../components/TierBox";

const SearchContainerCard = styled(Card)(() => ({
	height: "608px",
	"--CardCover-radius": "0px",
	border: "0px",
}));

const SearchCardContent = styled(CardContent)(() => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	position: "relative",
}));

const SearchBox = styled(Box)(() => ({
	display: "flex",
	alignItems: "center",
	width: "400px",
	height: "50px",
	padding: "4px",
	backgroundColor: "white",
}));

const InputField = styled(InputBase)(() => ({
	width: "100%",
	marginLeft: "16px",
}));

const MainContentContainer = styled(Box)(() => ({
	display: "flex",
	margin: "16px 0px 16px 0px",
}));

const IntroCard = styled(Card)(() => ({
	flex: 1,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const VideoCard = styled(Card)(() => ({
	width: "480px",
	height: "270px",
}));

const PatchCard = styled(Card)(() => ({
	flex: 1,
}));

const MoreBox = styled(Box)(() => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const NicknameBox = styled(Box)(() => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
}));

const DropDownContainer = styled(Box)(() => ({
	position: "absolute",
	top: "calc(100% - 270px)",
	marginLeft: "-42px",
	padding: "16px",
	width: "332px",
	backgroundColor: "white",
	zIndex: 1000000,
	boxShadow: "rgba(0, 0, 0, 0.3) 0px 8px 12px 0px",
}));

interface DropDownProps {
	nicknames: string[];
	onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	remove: (index: number) => void;
	style: React.CSSProperties;
}

function DropDown(props: DropDownProps) {
	const { nicknames, onMouseDown, remove, style } = props;
	return (
		<DropDownContainer onMouseDown={onMouseDown} style={style}>
			<div>최근 검색</div>
			{nicknames.map((nickname, index) => (
				<NicknameBox key={index}>
					<RouterLink style={{ textDecoration: "none" }} to={`/players/${nickname}`}>
						{nickname}
					</RouterLink>
					<IconButton onMouseDown={() => remove(index)}>
						<DeleteIcon />
					</IconButton>
				</NicknameBox>
			))}
		</DropDownContainer>
	);
}

function PatchNotes({ news }: { news: NewsDTO[] }) {
	return (
		<Stack spacing={2}>
			<Typography>최근 패치 노트</Typography>
			{news.map((note, index) => (
				<MuiLink key={index} href={note.url} underline="none" target="_blank">
					· {note.title}
				</MuiLink>
			))}
		</Stack>
	);
}

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

	const removeStorage = (index: number) => {
		const nicknames = localStorage.getItem("nickname");
		if (nicknames) {
			const nicknamesArr: string[] = JSON.parse(nicknames);
			nicknamesArr.splice(index, 1);
			localStorage.setItem("nickname", JSON.stringify([...nicknamesArr]));
			setRecentNickname([...nicknamesArr]);
		}
	};

	const keyDownHandler = (ev: React.KeyboardEvent<HTMLInputElement>) => {
		if (ev.key === "Enter") {
			buttonHandler();
		}
	};
	const buttonHandler = () => {
		if (nickname.trim().length === 0) {
			alert("공백 없이 입력해주세요.");
		} else {
			navigate(`/players/${nickname}`);
		}
	};
	const inputChangeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(ev.target.value);
	};
	const moreHandler = () => {
		navigate("/ranking");
	};

	if (loading) return <Loading />;

	return (
		<Box>
			<SearchContainerCard>
				<CardCover>
					<img src="https://lumia.kr/image/background.png" />
				</CardCover>
				<SearchCardContent>
					<SearchBox>
						<InputField placeholder="플레이어 검색" onKeyDown={keyDownHandler} onChange={inputChangeHandler} onFocus={() => setDisplay("block")} onBlur={() => setDisplay("none")} />
						<IconButton type="submit" onClick={buttonHandler}>
							<SearchIcon />
						</IconButton>
					</SearchBox>
					<DropDown nicknames={recentNickname} onMouseDown={(event) => event.preventDefault()} remove={removeStorage} style={{ display }} />
				</SearchCardContent>
			</SearchContainerCard>
			<MainContentContainer>
				<IntroCard>
					<Typography fontWeight="bold">Front-End</Typography>
					<MuiLink href="https://github.com/p1432pop/web" target="_blank">
						<img alt="GitHub" src="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white" />
					</MuiLink>
					<Typography fontWeight="bold">Back-End</Typography>
					<MuiLink href="https://github.com/p1432pop/lumia-server" target="_blank">
						<img alt="GitHub" src="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white" />
					</MuiLink>
					<Typography fontWeight="bold">API-DOCS</Typography>
					<MuiLink href="https://lumia.kr/api" target="_blank">
						<img alt="GitHub" src="https://img.shields.io/badge/swagger-85EA2D.svg?&style=for-the-badge&logo=swagger&logoColor=white" />
					</MuiLink>
				</IntroCard>
				<VideoCard>
					<CardCover>
						<iframe style={{ border: "0px" }} src="https://www.youtube.com/embed/UPLx3SphHP4?&wmode=opaque" allowFullScreen></iframe>
					</CardCover>
				</VideoCard>
				<PatchCard>
					<PatchNotes news={news} />
				</PatchCard>
			</MainContentContainer>
			<TableContainer component={Paper}>
				<Table>
					<caption>
						<MoreBox>
							<IconButton onClick={moreHandler}>
								<AddIcon />
							</IconButton>
							더 보기
						</MoreBox>
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
						{ranking.map((row, index) => (
							<StyledTableRow key={index}>
								<StyledTableCell>{index + 1}</StyledTableCell>
								<StyledTableCell>
									<RouterLink style={{ textDecoration: "none" }} to={`/players/${row.nickname}`}>
										{row.nickname}
									</RouterLink>
								</StyledTableCell>
								<StyledTableCell>
									<TierBox>
										<BorderAvatar src={getTierImg(row.mmr, 1 + index)} />
										{getTierName(row.mmr, 1 + index)}
									</TierBox>
								</StyledTableCell>
								<StyledTableCell>{row.mmr >= 7000 ? row.mmr - 7000 : row.mmr % 250}</StyledTableCell>
								<StyledTableCell>{(row.top1 * 100).toFixed(1)}%</StyledTableCell>
								<StyledTableCell>#{row.averageRank.toFixed(1)}</StyledTableCell>
								<StyledTableCell>{row.averageKills.toFixed(2)}</StyledTableCell>
								<StyledTableCell>
									<MostCharacterImages codes={row.characterStats.map((characterStat) => characterStat.characterCode)} />
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
