import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICategory } from "models/ICategory";
import { BASE_URL } from "shared/data/constants";

export const categoriesAPI = createApi({
  reducerPath: "categoriesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: "/categories",
        // mode: "",
        // credentials: "include",
        // headers: {
        //   "Authorization": `Bearer ${localStorage.getItem("token")}`,
        //   "Access-Control-Allow-Credentials": true,
        //   "Access-Control-Allow-Origin": "*",
        //   "Content-Type": "application/json",
        //   "X-Requested-With": "XMLHttpRequest",
        // }
      }),
      providesTags: ["Categories"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesAPI;
