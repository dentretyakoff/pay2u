import {
  ChangeEvent,
  memo,
} from "react";
import { useAppDispatch, useAppSelector } from "shared/hooks/redux";
import {
  updateQuery,
} from "store/reducers/searchSlice";
import cls from "./SearchBar.module.scss";

export const SearchBar = memo(() => {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.query);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(updateQuery(event.target.value));
  };

  return (
    <div className={cls.SearchBar}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Поиск..."
        className={cls.input}
      />
    </div>
  );
});
