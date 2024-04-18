import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadPlayer = createAsyncThunk("load/Player", async (nickname) => {
	const response = await axios.get(`http://localhost:8080/player/recent/${nickname}/23`);
	return response.data;
});
export const getMore = createAsyncThunk("load/More", async ({ userNum, next }) => {
	const response = await axios.get(`http://localhost:8080/player/past/${userNum}?next=${next}`);
	return response.data;
});
export const updatePlayer = createAsyncThunk("update/Player", (data) => {
	return axios.post(`http://localhost:8080/player`, {
		nickname: data.nickname,
		userNum: data.userNum,
		next: data.next,
	});
});
export const loadGame = createAsyncThunk("load/Game", (gameId) => {
	return axios.get(`http://localhost:8080/game/${gameId}`);
});
function gameSetting(state, data) {
	state.updated = new Date(data.updated);
	state.userNum = data.userNum;
	state.nickname = data.nickname;
	state.next = data.next;
	state.rank = data.rank;
	state.mmr = data.mmr;
	state.accountLevel = data.accountLevel;
	state.characterCode = data.characterCode;
	state.games = data.games;
	for (let game of state.games) {
		let equip = [];
		let obj = JSON.parse(game.equipment);
		for (let i = 0; i < 5; i++) {
			equip.push(obj[`${i}`]);
		}
		game.equipment = equip;
		game.traitFirstSub = JSON.parse(game.traitFirstSub);
		game.traitSecondSub = JSON.parse(game.traitSecondSub);
	}
}
export const playerSlice = createSlice({
	name: "player",
	initialState: {},
	reducers: {
		setOpen(state) {
			state.open = false;
			state.userGames = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadPlayer.pending, (state) => {
				state.games = [];
				state.view = 1;
				state.onload = false;
				state.updateLoading = false;
				state.userNum = 0;
				state.characterCode = 0;
				state.updated = undefined;
				state.mmr = -1;
				state.rank = 0;
			})
			.addCase(loadPlayer.fulfilled, (state, action) => {
				state.status = 200;
				state.onload = true;
				let data = action.payload.playerData;
				state.playerStats = action.payload.playerStats;
				state.view = data.view;
				gameSetting(state, data);
			})
			.addCase(loadPlayer.rejected, (state, action) => {
				state.status = 404;
				state.onload = true;
			})
			.addCase(updatePlayer.pending, (state, action) => {
				state.updateLoading = true;
			})
			.addCase(updatePlayer.fulfilled, (state, action) => {
				state.updateLoading = false;
				let data = action.payload.data;
				console.log(action.payload.data);
				state.view = data.view;
				gameSetting(state, data);
			})
			.addCase(updatePlayer.rejected, (state, action) => {
				state.updateLoading = false;
			})
			.addCase(loadGame.pending, (state, action) => {})
			.addCase(loadGame.fulfilled, (state, action) => {
				state.userGames = action.payload.data.userGames.sort((a, b) => {
					if (a.gameRank > b.gameRank) return 1;
					else if (a.gameRank < b.gameRank) return -1;
					else return 0;
				});
				for (let player of state.userGames) {
					let equip = [];
					for (let i = 0; i < 5; i++) {
						equip.push(player.equipment[`${i}`]);
					}
					player.equipment = equip;
				}
				let result = [];
				for (let i = 0; i < state.userGames.length; i += 3) {
					const team = state.userGames.slice(i, i + 3);
					result.push(team);
				}
				state.userGames = result;
				state.open = true;
			})
			.addCase(loadGame.rejected, (state, action) => {})
			.addCase(getMore.pending, (state, action) => {})
			.addCase(getMore.fulfilled, (state, action) => {
				for (let game of action.payload.games) {
					let equip = [];
					let obj = JSON.parse(game.equipment);
					for (let i = 0; i < 5; i++) {
						equip.push(obj[`${i}`]);
					}
					game.equipment = equip;
					game.traitFirstSub = JSON.parse(game.traitFirstSub);
					game.traitSecondSub = JSON.parse(game.traitSecondSub);
				}
				state.games.push(...action.payload.games);
				state.next = action.payload.next;
			})
			.addCase(getMore.rejected, (state, action) => {});
	},
});

export const { setOpen } = playerSlice.actions;

export default playerSlice.reducer;
