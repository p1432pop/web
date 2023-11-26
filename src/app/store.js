import { configureStore } from "@reduxjs/toolkit";
import rankReducer from "../rankSlice";
import playerReducer from "../playerSlice";
const store = configureStore({
  reducer: {
    rank: rankReducer,
    player: playerReducer
  }
});

export default store;