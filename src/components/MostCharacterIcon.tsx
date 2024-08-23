import { Avatar, Box, styled } from "@mui/material";

const AvatarBox = styled(Box)(() => ({
	width: "100%",
	display: "grid",
	gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
	justifyItems: "center",
	gap: "8px",
}));

export const BorderAvatar = styled(Avatar)(() => ({
	border: "1px solid black",
}));

export function MostCharacterImages({ codes }: { codes: number[] }) {
	return (
		<AvatarBox>
			{codes.map((code, index) => (
				<BorderAvatar key={index} src={`https://lumia.kr/image/CharacterIcon/${code}.png`} />
			))}
		</AvatarBox>
	);
}
