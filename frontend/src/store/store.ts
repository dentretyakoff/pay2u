import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { categoriesAPI } from "services/CategoriesService";
import userReducer from "./reducers/UserSlice";
// import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  userReducer,
  [categoriesAPI.reducerPath]: categoriesAPI.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(categoriesAPI.middleware);
    }
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
