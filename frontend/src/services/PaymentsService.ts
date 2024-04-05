import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IExpenses, IPayment } from "models/IPayments";
import { BASE_URL } from "shared/data/constants";

export const paymentsAPI = createApi({
  reducerPath: "paymentsAPI",
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
  tagTypes: ["Payments"],
  endpoints: (builder) => ({
    getPayments: builder.query<IPayment[], void>({
      query: () => ({
        url: "/payments/",
      }),
      providesTags: ["Payments"],
    }),
    getExpenses: builder.query<IExpenses, void>({
      query: () => ({
        url: "/payments/expenses/",
      }),
      providesTags: ["Payments"],
    }),
  }),
});

export const { useGetPaymentsQuery, useGetExpensesQuery } = paymentsAPI;
