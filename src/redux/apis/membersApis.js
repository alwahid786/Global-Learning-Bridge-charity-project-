import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const memberApis = createApi({
  reducerPath: "memberApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("SERVER_URL")}/api/members`,
    credentials: "include",
  }),
  tagTypes: ["Members"],

  endpoints: (builder) => ({
    // Get all clients
    getClients: builder.query({
      query: () => ({
        url: "/getClients",
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),

    // Get single Client by ID
    getClientById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Members", id }],
    }),

    // Add new Member
    createMember: builder.mutation({
      query: (data) => ({
        url: "/createMember",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Members"],
    }),

    // Update Client
    updateClient: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/updateClient/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Members"],
    }),

    // Delete Client
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/deleteClient/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Members"],
    }),

    // Get Active Inactive Count
    getActiveInactiveCount: builder.query({
      query: () => ({
        url: "/getActiveInactiveCount",
        method: "GET",
      }),
    }),

    // Get Clients Stat
    getClientsStat: builder.query({
      query: () => ({
        url: "/getClientStats",
        method: "GET",
      }),
    }),

    // Get Clients Stats By Filters Today, Week, Month
    getClientsStatByFilters: builder.query({
      query: () => ({
        url: "/getClientsStatsByFilters",
        method: "GET",
      }),
    }),

    // Get Clients Activity Stats
    getClientsActivityStats: builder.query({
      query: () => ({
        url: "/getClientsActivityStats",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateMemberMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetActiveInactiveCountQuery,
  useGetClientsStatQuery,
  useGetClientsStatByFiltersQuery,
  useGetClientsActivityStatsQuery,
} = memberApis;

export default memberApis;
