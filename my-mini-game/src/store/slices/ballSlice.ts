import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Position {
  lat: number;
  lng: number;
}

interface BallState {
  ballPosition: Position;
  goalPosition: Position;
}

const initialState: BallState = {
  ballPosition: { lat: 0, lng: 0 },
  goalPosition: { lat: 100, lng: 100 },
};

const ballSlice = createSlice({
  name: "ball",
  initialState,
  reducers: {
    setBallPosition(state, action: PayloadAction<Position>) {
      state.ballPosition = action.payload;
    },
    setGoalPosition(state, action: PayloadAction<Position>) {
      state.goalPosition = action.payload;
    },
  },
});

export const { setBallPosition, setGoalPosition } = ballSlice.actions;
export default ballSlice.reducer;
