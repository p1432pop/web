import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import axios from "axios";
import { Api } from "../axios/axios.js";
const defaultValue = await Api.getRanking(23, 1);

export const getRanking1 = createAsyncThunk("load/Season", async ({ seasonId, page }) => {
	const response = await Api.getRanking(seasonId, page);
	return response;
});

export const rankSlice = createSlice({
	name: "rank",
	initialState: {
		data: defaultValue.data,
		page: 1,
		seasonId: 23,
		updated: new Date(defaultValue.updated),
	},
	extraReducers: (builder) => {
		builder.addCase(getRanking1.fulfilled, (state, action) => {
			state.data = action.payload.data;
			state.page = action.meta.arg.page;
			state.seasonId = action.meta.arg.seasonId;
			state.updated = new Date(action.payload.updated);
		});
	},
});

export default rankSlice.reducer;
