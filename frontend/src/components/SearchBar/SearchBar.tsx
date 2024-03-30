import { ChangeEvent, FormEvent, memo, useState } from "react";
import { useAppDispatch, useAppSelector } from "shared/hooks/redux";
import { useGetFindServicesQuery } from "services/ServicesService";
import { updateQuery, updateResults } from "store/reducers/searchSlice";
import cls from "./SearchBar.module.scss";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchBar = memo(({ onSearch }: SearchBarProps) => {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.query);

  const {
    data: results,
    error,
    isFetching,
    refetch,
  } = useGetFindServicesQuery(query, { skip: query === "" });

  const handleSearch = () => {
    dispatch(updateResults([]));
    refetch();
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // setSearchTerm(event.target.value);
    dispatch(updateQuery(event.target.value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm);
  };
  return (
    <div className={cls.SearchBar}>
      <form onSubmit={handleSubmit} className={cls.form}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Поиск..."
          className={cls.input}
        />
      </form>
    </div>
  );
});
