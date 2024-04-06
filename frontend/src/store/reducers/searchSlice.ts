import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IService } from "models/IService";

interface SearchState {
  query: string;
  results: IService[];
}

const initialState: SearchState = {
  query: "",
  results: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updateQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    updateResults(state, action: PayloadAction<IService[]>) {
      state.results = action.payload;
    },
  },
});

export const { updateQuery, updateResults } = searchSlice.actions;

// export default searchSlice.reducer;

export const searchReducer = searchSlice.reducer;
