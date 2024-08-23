import { useEffect, useState } from "react";
import { Api } from "../../axios/axios";
import { Avatar, Box, Card, FormControl, MenuItem, Select, SelectChangeEvent, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { MatchingMode } from "../../axios/dto/user/user.enum";
import StatisticsTable from "./StatisticsTable";
import Loading from "../../components/Loading";
import { VersionStat } from "../../axios/dto/statistics/versionStat.dto";

const tierItem = [
	{ value: "Mithril", src: "https://lumia.kr/image/tier/Mithril.png", text: "미스릴+" },
	{ value: "Diamond", src: "https://lumia.kr/image/tier/Diamond.png", text: "다이아몬드" },
	{ value: "Platinum", src: "https://lumia.kr/image/tier/Platinum.png", text: "플래티넘" },
	{ value: "Gold", src: "https://lumia.kr/image/tier/Gold.png", text: "골드" },
	{ value: "Silver", src: "https://lumia.kr/image/tier/Silver.png", text: "실버" },
	{ value: "Bronze", src: "https://lumia.kr/image/tier/Bronze.png", text: "브론즈" },
	{ value: "Iron", src: "https://lumia.kr/image/tier/Iron.png", text: "아이언" },
];

const versionItem = [
	{ value: "1.28.0", text: "v1.28.0" },
	{ value: "1.27.0", text: "v1.27.0" },
	{ value: "1.26.0", text: "v1.26.0" },
];

export default function Statistics() {
	const [loading, setLoading] = useState(true);
	const [stat, setStat] = useState<VersionStat[]>([]);
	const [version, setVersion] = useState("1.28.0");
	const [tier, setTier] = useState("Mithril");
	const [matchingMode, setMatchingMode] = useState(MatchingMode.RANK);
	useEffect(() => {
		setLoading(true);
		const setup = async () => {
			const result = await Api.getStatistics({ version, matchingMode, tier });
			setStat(result);
			setLoading(false);
		};
		setup();
	}, []);

	const handleMatchingMode = async (event: React.SyntheticEvent, newValue: MatchingMode) => {
		const result = await Api.getStatistics({ version, matchingMode: newValue, tier });
		setStat(result);
		setMatchingMode(newValue);
	};

	const handleVersion = async (event: SelectChangeEvent) => {
		const newValue = event.target.value;
		const result = await Api.getStatistics({ version: newValue, matchingMode, tier });
		setStat(result);
		setVersion(newValue);
	};

	const handleTier = async (event: SelectChangeEvent) => {
		const newValue = event.target.value;
		const result = await Api.getStatistics({ version, matchingMode, tier: newValue });
		setStat(result);
		setTier(newValue);
	};

	return (
		<Card sx={{ backgroundColor: "#eeeeee", padding: "8px" }}>
			<TabContext value={matchingMode}>
				<Box sx={{ display: "flex", border: 1, borderColor: "divider", backgroundColor: "white", justifyContent: "space-between", mb: 1 }}>
					<TabList onChange={handleMatchingMode}>
						<Tab sx={{ height: 76 }} label="랭크" value={MatchingMode.RANK} />
						<Tab sx={{ height: 76 }} label="일반" value={MatchingMode.NORMAL} />
					</TabList>
					<Box sx={{ display: "flex", gap: "16px", m: 1 }}>
						<FormControl>
							<Select value={version} onChange={handleVersion} sx={{ width: 120, height: 60 }}>
								{versionItem.map((item) => (
									<MenuItem value={item.value}>{item.text}</MenuItem>
								))}
							</Select>
						</FormControl>
						{matchingMode === MatchingMode.RANK ? (
							<FormControl>
								<Select value={tier} onChange={handleTier} sx={{ width: 160, height: 60 }}>
									{tierItem.map((item) => (
										<MenuItem value={item.value}>
											<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
												<Avatar sx={{ border: "1px solid black", width: "24px", height: "24px" }} src={item.src} />
												{item.text}
											</div>
										</MenuItem>
									))}
								</Select>
							</FormControl>
						) : null}
					</Box>
				</Box>
				{loading ? (
					<Loading />
				) : (
					<>
						<TabPanel sx={{ padding: "0" }} value={MatchingMode.RANK}>
							<StatisticsTable stat={stat} matchingMode={MatchingMode.RANK} />
						</TabPanel>
						<TabPanel sx={{ padding: "0" }} value={MatchingMode.NORMAL}>
							<StatisticsTable stat={stat} matchingMode={MatchingMode.NORMAL} />
						</TabPanel>
					</>
				)}
			</TabContext>
		</Card>
	);
}
