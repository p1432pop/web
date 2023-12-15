import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const loadPlayer = createAsyncThunk(
    "load/Player",
    (nickname) => {
        return axios.get(`/play/${nickname}`);
        
    }
)
export const updatePlayer = createAsyncThunk(
    "update/Player",
    (data) => {
        console.log(data.updated)
        return axios.post(`/play`, {
          nickname: data.nickname,
          userNum: data.userNum,
          updated: data.updated
        })
    }
)
export const loadGame = createAsyncThunk(
    "load/Game",
    (gameId) => {
        return axios.get(`/game/${gameId}`);
    }
)
function gameSetting(state, data) {
    state.updated = new Date(data.updated);
    console.log(data.userNum, 'here')
    state.userNum = data.userNum;
    if (data.games.length !== 0) {
        state.rank = data.rank;
        state.mmr = data.games[0].mmrAfter;
        state.level = data.games[0].accountLevel;
        state.characterCode = data.games[0].characterNum
        state.games = data.games.slice(0, 20)
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
}
export const playerSlice = createSlice({
    name: "player",
    initialState: {
        games: [],
        view: 1,
        status: 200,
        onload: false,
        updateLoading: false,
        userNum: 0,
        characterCode: 0,
        updated: undefined,
        mmr: -1,
        level: 0,
        rank: 0,
        userGames: [],
        open: false
    },
    reducers: {
        setOpen(state, action) {
            state.open = false;
            console.log(1)
            state.userGames = []
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loadPlayer.pending, (state, action) => {
            state.games = [];
            state.view = 1;
            state.onload = false;
            state.updateLoading = false;
            state.userNum = 0;
            state.characterCode = 0;
            state.updated = undefined;
            state.mmr = -1;
            state.level = 0;
            state.rank = 0;
        })
        .addCase(loadPlayer.fulfilled, (state, action) => {
            state.status = action.payload.status
            state.onload = true;
            let data = action.payload.data;
            state.view = data.view;
            gameSetting(state, data)
        })
        .addCase(loadPlayer.rejected, (state, action) => {
            state.onload = true;
            console.log(action)
            state.status = 404
        })
        .addCase(updatePlayer.pending, (state, action) => {
            console.log(action, 'p');
            state.updateLoading = true;
        })
        .addCase(updatePlayer.fulfilled, (state, action) => {
            state.updateLoading = false;
            let data = action.payload.data;
            state.view = data.view;
            gameSetting(state, data)
        })
        .addCase(updatePlayer.rejected, (state, action) => {
            console.log(action, 'r');
        })
        .addCase(loadGame.pending, (state, action) => {
            console.log('pending')
        })
        .addCase(loadGame.fulfilled, (state, action) => {
            state.userGames = action.payload.data.userGames.sort((a, b) => {
                if (a.gameRank > b.gameRank) return 1;
                else if (a.gameRank < b.gameRank) return -1;
                else return 0;
            })
            for(let player of state.userGames) {
                let equip = []
                for(let i=0; i<5; i++) {
                    equip.push(player.equipment[`${i}`])
                }
                player.equipment = equip
            }
            let result = []
            for(let i=0; i<state.userGames.length; i+=3) {
                const team = state.userGames.slice(i, i+3);
                result.push(team)
            }state.userGames = result;
            state.open = true;
            console.log(state.userGames)
        })
        .addCase(loadGame.rejected, (state, action) => {
            
        })
    }
});

export const {setOpen} = playerSlice.actions;

export default playerSlice.reducer;