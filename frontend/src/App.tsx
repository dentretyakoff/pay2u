import { useEffect } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { userSlice } from "./store/reducers/UserSlice";
import { fetchUsers } from "./store/reducers/ActionCreators";

function App() {
  const { count } = useAppSelector((state) => state.userReducer);
  const { increment } = userSlice.actions;
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    dispatch(fetchUsers());
    // dispatch(userSlice.actions.usersfetching());
    // fetch("https://jsonplaceholder.typicode.com/users")
    //   .then((response) => response.json())
    //   .then((data) => dispatch(userSlice.actions.usersfetchSuccess(data)))
    //   .catch((error) => dispatch(userSlice.actions.usersfetchError(error.message)));
  }, [])
  return (
    <div>
      <h1>{count}</h1>
      <button type="button" onClick={() => dispatch(increment(1))}>increment</button>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {JSON.stringify(users, null, 2)}
    </div>
  );
}

export default App;
