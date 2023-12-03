import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const loadPlayer = createAsyncThunk(
    "load/Player",
    (nickname) => {
        return axios.get(`http://localhost:8080/play/${nickname}`);
    }
)
export const updatePlayer = createAsyncThunk(
    "update/Player",
    (nickname) => {
        return axios.get(`http://localhost:8080/updatePlay/${nickname}`)
    }
)

export const playerSlice = createSlice({
  name: "player",
  // 초깃값
  initialState: {
    games: [],
    state: false,
    loading: 0,
    onload: false,
    characterCode: 0,
    nickname: "",
    updated: "기록 없음",
    mmr: 0,
    level: 0,
  },
  // 리듀서
  reducers: {
    setOnload(state, action) {
      
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPlayer.pending, (state, action) => {
        state.onload = false;
        state.games = [];
        state.state = false;
        state.loading = 0;
        state.characterCode = 0;
        state.nickname = "";
        state.updated = "기록 없음";
        state.mmr = 0;
        state.level = 0;
      })
      .addCase(loadPlayer.fulfilled, (state, action) => {
      console.log(action)
      state.onload = true;
      state.loading = action.payload.status;
      if (state.loading === 200) {
        state.state = action.payload.data.state;
        state.mmr = action.payload.data.data[0].mmrAfter;
        state.level = action.payload.data.data[0].accountLevel;
        console.log(JSON.parse(action.payload.data.data[0].traitSecondSub)[0])
        state.updated = action.payload.data.updated;
        state.games = action.payload.data.data.slice(0, 20)
        for(let game of state.games) {
          let equip = []
          let obj = JSON.parse(game.equipment)
          for(let i=0; i<5; i++) {
            equip.push(obj[`${i}`])
          }
          game.equipment = equip
          game.traitFirstSub = JSON.parse(game.traitFirstSub)
          game.traitSecondSub = JSON.parse(game.traitSecondSub)
        }
      }
      else if (state.loading === 204) {
        console.log(204)
      }
    }).addCase(loadPlayer.rejected, (state, action) => {
      state.onload = true;
      console.log(action)
      state.loading = 404
    })
  }
});

//export const {} = playerSlice.actions;

export default playerSlice.reducer;