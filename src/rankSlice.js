import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const response = await axios.get('http://localhost:8080/rank/2')

export const loadSeason = createAsyncThunk(
  "load/Season",
  (season) => {
    return axios.get(`http://localhost:8080/rank/${season}`);
  }
)

export const rankSlice = createSlice({
  name: "rank",
  // 초깃값
  initialState: {
    data: response.data,
    //data: 1,
    page: 1,
    season: 2,
    current: response.data.slice(0, 100)
    //current: 1
  },
  // 리듀서
  reducers: {
    setPage(state, action) {
      const page = action.payload
      state.page = page
      state.current = state.data.slice((page-1)*100, page*100)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadSeason.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.page = 1
      state.current = action.payload.data.slice(0, 100);
      state.season = action.meta.arg;
    })
  }
});

export const { setPage } = rankSlice.actions;

export default rankSlice.reducer;