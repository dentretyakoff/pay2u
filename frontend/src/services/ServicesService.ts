import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IService } from "models/IService";
import { BASE_URL } from "shared/data/constants";

export const servicesAPI = createApi({
  reducerPath: "servicesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    getServices: builder.query<IService[], void>({
      query: () => ({
        url: "/services/",
      }),
      providesTags: ["Services"],
    }),
    getNewServices: builder.query<IService[], void>({
      query: () => ({
        url: "/services/new/",
      }),
      providesTags: ["Services"],
    }),
    getFindServices: builder.query<IService[], string>({
      query: (name) => ({
        url: `/services/?name=${name}`,
      }),
      providesTags: ["Services"],
    }),
    getServicesByCategory: builder.query<IService[], number>({
      query: (category) => ({
        url: `/services/?category_id=${category}`,
      }),
      providesTags: ["Services"],
    }),
    getFavorites: builder.query<IService[], void>({
      query: () => ({
        url: "/services/favorites/",
      }),
      providesTags: ["Services"],
    }),
    addFavorite: builder.mutation<IService, number>({
      query: (id) => ({
        url: `/services/${id}/favorite/`,
        method: "POST",
      }),
      invalidatesTags: ["Services"],
    }),
    deleteFavorite: builder.mutation<IService, number>({
      query: (id) => ({
        url: `/services/${id}/favorite/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    })
  }),
});

export const {
  useGetServicesQuery,
  useGetNewServicesQuery,
  useGetFindServicesQuery,
  useGetServicesByCategoryQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useDeleteFavoriteMutation
} = servicesAPI;
