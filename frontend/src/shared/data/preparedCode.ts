// searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
  results: any[];
}

const initialState: SearchState = {
  query: '',
  results: [],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    updateQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    updateResults(state, action: PayloadAction<any[]>) {
      state.results = action.payload;
    },
  },
});

export const { updateQuery, updateResults } = searchSlice.actions;

// searchApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface SearchResult {
  id: number;
  name: string;
}

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    search: builder.query<SearchResult[], string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

export const { useSearchQuery } = searchApi;

// SearchComponent.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchQuery } from './searchApi';
import { updateQuery, updateResults } from './searchSlice';

interface SearchComponentProps {
  // Add any props here if needed
}

const SearchComponent: React.FC<SearchComponentProps> = () => {
  const dispatch = useDispatch();
  const query = useSelector((state: { search: SearchState }) => state.search.query);
  const { data: results, error, isLoading, refetch } = useSearchQuery(query);

  const handleSearch = () => {
    dispatch(updateResults([])); // Clear previous results
    refetch();
  };

  return (
    <div>
      <input value={query} onChange={(e) => dispatch(updateQuery(e.target.value))} />
      <button onClick={handleSearch}>Search</button>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <ul>
          {results.map((result) => (
            <li key={result.id}>{result.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;