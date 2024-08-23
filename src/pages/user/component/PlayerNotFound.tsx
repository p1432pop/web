import { Card, Typography } from "@mui/joy";

export default function PlayerNotFound({ nickname }: { nickname: string }) {
	return (
		<Card sx={{ backgroundColor: "aliceblue", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<Card sx={{ backgroundColor: "antiquewhite", minWidth: "10%", textAlign: "center" }}>
				<Typography>{nickname}</Typography>
			</Card>
			<Typography>해당 닉네임의 플레이어를 찾을 수 없습니다.</Typography>
			<Typography>다시 검색해 주세요.</Typography>
		</Card>
	);
}
