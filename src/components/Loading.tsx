import { Box, styled, CircularProgress } from "@mui/material";

const LoadingContainer = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "16px 0px 16px 0px",
}));

const LoadingContent = styled(Box)(() => ({
	marginBottom: "16px",
}));

export default function Loading() {
	return (
		<LoadingContainer>
			<LoadingContent>잠시만 기다려 주세요.</LoadingContent>
			<CircularProgress />
		</LoadingContainer>
	);
}
