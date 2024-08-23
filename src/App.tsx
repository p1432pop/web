import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./pages/main/Main";
import Ranking from "./pages/rank/Ranking";
import Guide from "./pages/guide/Guide";
import Player from "./pages/user/Player";
import Statistics from "./pages/statistics/Statistics";
import { Box, styled } from "@mui/material";

export default function App() {
	return (
		<AppRoot>
			<BrowserRouter>
				<Header />
				<Content>
					<Routes>
						<Route path="/" element={<Main />}></Route>
						<Route path="/ranking" element={<Ranking />}></Route>
						<Route path="/guide" element={<Guide />}></Route>
						<Route path="/players/:nickname" element={<Player />}></Route>
						<Route path="/statistics" element={<Statistics />}></Route>
					</Routes>
				</Content>
				<Footer />
			</BrowserRouter>
		</AppRoot>
	);
}

const AppRoot = styled(Box)(() => ({
	overflow: "hidden",
	backgroundColor: "#f5f5f5",
}));

const Content = styled(Box)(() => ({
	maxWidth: "1080px",
	minWidth: "1080px",
	width: "100%",
	margin: "auto",
}));
