import { Avatar, Button, Card, Chip, CircularProgress, Tooltip } from "@mui/material";
import { UserDTO } from "../../../axios/dto/user/user.dto";
import styles from "../Player.module.css";
import { UserStatDTO } from "../../../axios/dto/user/userStat.dto";
import { getTierImg, getTierName } from "../../../utils/tier";
import { UserRank } from "../../../axios/dto/user/userRank.dto";
import { useEffect, useState } from "react";
import { Api } from "../../../axios/axios";
import { useNavigate } from "react-router-dom";
import { UserCharacterStat } from "../../../axios/dto/user/userCharacterStat.dto";

export default function UserProfile({ user, stat }: { user: UserDTO; stat: UserCharacterStat[] }) {
	const [userRank, setUserRank] = useState<UserRank>();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		const setup = async () => {
			const userRank = await Api.getUserRank(user.userNum);
			setUserRank(userRank);
		};
		setup();
	}, []);

	const updatable = (updated: string | null): boolean => {
		if (updated) {
			const updatedTime = new Date(updated);
			return new Date().getTime() - updatedTime.getTime() > 5 * 60 * 1000;
		}
		return true;
	};

	const calPastTime = (updated: string | null) => {
		if (updated) {
			let now = new Date();
			let updatedTime = new Date(updated);
			let time = now.getTime() - updatedTime.getTime();
			if (time < 60 * 1000) {
				return `${Math.floor(time / 1000)}초 전`;
			}
			if (time < 60 * 60 * 1000) {
				return `${Math.floor(time / 1000 / 60)}분 전`;
			}
			if (time < 24 * 60 * 60 * 1000) {
				return `${Math.floor(time / 1000 / 60 / 60)}시간 전`;
			}
			return `${Math.floor(time / 1000 / 60 / 60 / 24)}일 전`;
		}
		return "기록 없음";
	};

	const title = (season: number) => {
		if (season >= 19) {
			return `S${Math.floor(season / 2) - 8}`;
		} else {
			return `EA_S${Math.floor(season / 2) + 1}`;
		}
	};

	const content = (matchingTeamMode: number): string => {
		if (matchingTeamMode === 1) return "솔로";
		if (matchingTeamMode === 2) return "듀오";
		return "스쿼드";
	};

	const updateButtonHandler = () => {
		setLoading(true);
		updateUser();
	};

	const updateUser = async () => {
		await Api.updatedPlayer(user.userNum);
		navigate(`/players/${user.nickname}`);
	};

	return (
		<Card style={{ display: "flex", backgroundColor: "#eeeeee" }}>
			<Avatar src={`https://lumia.kr/image/CharacterIcon/${stat[0]?.characterCode}.png`} style={{ height: 160, width: 160 }} />
			<div className={styles.profileContent}>
				<Chip label={`레벨 : ${user.accountLevel || 0}`} variant="outlined" />
				<div className={styles.nickname}>{user.nickname}</div>
				{updatable(user.updated) ? (
					loading ? (
						<CircularProgress />
					) : (
						<Button onClick={updateButtonHandler} variant="outlined">
							갱신 가능
						</Button>
					)
				) : (
					<Button className={styles.notAllowedButton} variant="outlined">
						갱신 불가
					</Button>
				)}
				최근 갱신 시간 : {calPastTime(user.updated)}
			</div>
			<div style={{ flex: 1 }}>
				<div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
					{user.prevStats.map((seasonData, index) => {
						return (
							<Tooltip
								key={index}
								title={seasonData.map((item) => {
									return (
										<div>
											{content(item.matchingTeamMode)} : {item.mmr}
										</div>
									);
								})}
							>
								<Chip
									size="small"
									variant="outlined"
									label={
										<>
											{title(seasonData[0].seasonId)} : {seasonData[0].mmr}
										</>
									}
									sx={{ color: "red", fontSize: "12px" }}
								/>
							</Tooltip>
						);
					})}
				</div>
			</div>
			<img className={styles.avatarTier} src={getTierImg(user.mmr!, userRank?.rank)} alt="img" />
			<div className={styles.dataBox}>
				<div>{user.mmr ? `${user.mmr}RP` : "기록 없음"}</div>
				<div>{user.mmr ? getTierName(user.mmr, userRank?.rank) : getTierName()}</div>
			</div>
		</Card>
	);
}
