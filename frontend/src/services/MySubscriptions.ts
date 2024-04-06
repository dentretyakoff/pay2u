import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IMySubscription } from "models/IMySubscription";
import { BASE_URL } from "shared/data/constants";

export const mySubscriptionsAPI = createApi({
  reducerPath: "mySubscriptionsAPI",
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
  tagTypes: ["MySubscriptions"],
  endpoints: (builder) => ({
    getMySubscriptions: builder.query<IMySubscription[], void>({
      query: () => ({
        url: "/mysubscriptions/",
      }),
      providesTags: ["MySubscriptions"],
    }),
    getMySubscription: builder.query<IMySubscription, number>({
      query: (id) => ({
        url: `/mysubscriptions/${id}/`,
      }),
      providesTags: ["MySubscriptions"],
    }),
    addRenewal: builder.mutation<IMySubscription, number>({
      query: (id) => ({
        url: `/mysubscriptions/${id}/renewal/`,
        method: "POST",
      }),
      invalidatesTags: ["MySubscriptions"],
    }),
    deleteRenewal: builder.mutation<IMySubscription, number>({
      query: (id) => ({
        url: `/mysubscriptions/${id}/renewal/`,
        method: "DELETE",
      }),
      invalidatesTags: ["MySubscriptions"],
    }),
    addSubscription: builder.mutation<IMySubscription, number>({
      query: (id) => ({
        url: `/subscriptions/${id}/subscribe/`,
        method: "POST",
      }),
      invalidatesTags: ["MySubscriptions"],
    })
  }),
});

export const {
  useGetMySubscriptionsQuery,
  useGetMySubscriptionQuery,
  useAddRenewalMutation,
  useDeleteRenewalMutation,
  useAddSubscriptionMutation
} = mySubscriptionsAPI;
