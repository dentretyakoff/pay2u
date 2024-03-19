import { createAsyncThunk } from "@reduxjs/toolkit";
// import { AppDispatch } from "../store";
// import { userSlice } from "./UserSlice";

// export const fetchUsers = () => async (dispatch: AppDispatch) => {
//   try {
//     dispatch(userSlice.actions.usersfetching());
//     const response = await fetch("https://jsonplaceholder.typicode.com/users", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     dispatch(userSlice.actions.usersfetchSuccess(await response.json()));
//   } catch (error) {
//     dispatch(userSlice.actions.usersfetchError((error as Error).message));
//   }
// };

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue("ne sudba");
    }
  }
);
