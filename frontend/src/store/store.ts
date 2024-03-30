import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { categoriesAPI } from "services/CategoriesService";
import { servicesAPI } from "services/ServicesService";
import { mySubscriptionsAPI } from "services/MySubscriptions";
import userReducer from "./reducers/UserSlice";
import searchSlice from "./reducers/searchSlice";
// import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  userReducer,
  search: searchSlice,
  [categoriesAPI.reducerPath]: categoriesAPI.reducer,
  [servicesAPI.reducerPath]: servicesAPI.reducer,
  [mySubscriptionsAPI.reducerPath]: mySubscriptionsAPI.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(
        categoriesAPI.middleware,
        servicesAPI.middleware,
        mySubscriptionsAPI.middleware
      );
    },
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
