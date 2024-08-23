import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { Api } from "../../axios/axios";
import GameTab from "./component/GameTab";
import PlayerNotFound from "./component/PlayerNotFound";
import { Card } from "@mui/material";
import { UserDTO } from "../../axios/dto/user/user.dto";
import UserProfile from "./component/UserProfile";
import UserStat from "./component/UserStat";
import { UserCharacterStat } from "../../axios/dto/user/userCharacterStat.dto";

export default function Player() {
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState(404);
	const [user, setUser] = useState<UserDTO>();
	const [stat, setStat] = useState<UserCharacterStat[]>([]);
	const params = useParams();

	useEffect(() => {
		setLoading(true);
		const setup = async () => {
			if (params.nickname) {
				const profile = await Api.getUserProfile(params.nickname);
				setStatus(profile.code);
				setUser(profile.user);
				if (profile.code === 200 && profile.user) {
					const userStat = await Api.getUserCharacterStat(profile.user.userNum);
					setStat(userStat);
					setLoading(false);
				}
			}
		};
		setup();
	}, [params]);

	if (loading) return <Loading />;
	if (status === 404) return <PlayerNotFound nickname={params.nickname!} />;
	if (status === 200 && user)
		return (
			<Card sx={{ backgroundColor: "#eeeeee", padding: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
				<UserProfile user={user} stat={stat} />
				<UserStat stat={stat} />
				<GameTab user={user} />
			</Card>
		);
	return <></>;
}
