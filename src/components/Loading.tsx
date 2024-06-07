import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
	return (
		<div style={{ paddingTop: "16px", paddingBottom: "16px", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
			<div style={{ marginBottom: "16px" }}>잠시만 기다려 주세요.</div>
			<CircularProgress />
		</div>
	);
}
