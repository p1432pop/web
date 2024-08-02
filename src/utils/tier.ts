interface Tier {
	minMMR: number;
	maxIdx?: number;
	name: string;
}

const tiers: Tier[] = [
	{ minMMR: 7000, maxIdx: 200, name: "이터니티" },
	{ minMMR: 7000, maxIdx: 700, name: "데미갓" },
	{ minMMR: 6800, name: "미스릴" },
	{ minMMR: 6400, name: "다이아몬드 1" },
	{ minMMR: 6000, name: "다이아몬드 2" },
	{ minMMR: 5600, name: "다이아몬드 3" },
	{ minMMR: 5200, name: "다이아몬드 4" },
	{ minMMR: 4850, name: "플래티넘 1" },
	{ minMMR: 4500, name: "플래티넘 2" },
	{ minMMR: 4150, name: "플래티넘 3" },
	{ minMMR: 3800, name: "플래티넘 4" },
	{ minMMR: 3500, name: "골드 1" },
	{ minMMR: 3200, name: "골드 2" },
	{ minMMR: 2900, name: "골드 3" },
	{ minMMR: 2600, name: "골드 4" },
	{ minMMR: 2350, name: "실버 1" },
	{ minMMR: 2100, name: "실버 2" },
	{ minMMR: 1850, name: "실버 3" },
	{ minMMR: 1600, name: "실버 4" },
	{ minMMR: 1400, name: "브론즈 1" },
	{ minMMR: 1200, name: "브론즈 2" },
	{ minMMR: 1000, name: "브론즈 3" },
	{ minMMR: 800, name: "브론즈 4" },
	{ minMMR: 600, name: "아이언 1" },
	{ minMMR: 400, name: "아이언 2" },
	{ minMMR: 200, name: "아이언 3" },
	{ minMMR: 0, name: "아이언 4" },
];

export const getTierName = (mmr: number = -1, idx: number = -1) => {
	for (const tier of tiers) {
		if (mmr >= tier.minMMR && (tier.maxIdx === undefined || idx <= tier.maxIdx)) {
			return tier.name;
		}
	}
	return "언랭크";
};

export const getTierImg = (mmr: number = -1, idx: number = -1) => {
	let url = getTierImg2(mmr, idx);
	return "https://lumia.kr/" + url;
};

export const getTierImg2 = (mmr: number = -1, idx: number = -1) => {
	if (mmr >= 7000 && idx <= 200) {
		return "image/tier/Immortal.png";
	}
	if (mmr >= 7000 && idx <= 700) {
		return "image/tier/Titan.png";
	}
	if (mmr >= 6800) {
		return "image/tier/Mithril.png";
	}
	if (mmr >= 5200) {
		return "image/tier/Diamond.png";
	}
	if (mmr >= 3800) {
		return "image/tier/Platinum.png";
	}
	if (mmr >= 2600) {
		return "image/tier/Gold.png";
	}
	if (mmr >= 1600) {
		return "image/tier/Silver.png";
	}
	if (mmr >= 800) {
		return "image/tier/Bronze.png";
	}
	if (mmr >= 0) {
		return "image/tier/Iron.png";
	}
	return "image/tier/Unrank.png";
};
