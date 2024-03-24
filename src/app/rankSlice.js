import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const response = await axios.get("http://localhost:8080/rank/23");

export const loadSeason = createAsyncThunk("load/Season", (season) => {
	return axios.get(`http://localhost:8080/rank/${season}`);
});

export const rankSlice = createSlice({
	name: "rank",
	// 초깃값
	initialState: {
		data: response.data.data,
		page: 1,
		season: 23,
		current: response.data.data.slice(0, 100),
		updated: new Date(response.data.updated),
	},
	// 리듀서
	reducers: {
		setPage(state, action) {
			const page = action.payload;
			state.page = page;
			state.current = state.data.slice((page - 1) * 100, page * 100);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(loadSeason.fulfilled, (state, action) => {
			state.data = action.payload.data.data;
			state.page = 1;
			state.current = state.data.slice(0, 100);
			state.season = action.meta.arg;
			state.updated = new Date(action.payload.data.updated);
			console.log(state.data);
		});
	},
});

export const { setPage } = rankSlice.actions;

export default rankSlice.reducer;
