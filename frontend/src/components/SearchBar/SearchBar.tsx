import { ChangeEvent, FormEvent, memo, useState } from "react";
import cls from "./SearchBar.module.scss";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchBar = memo(({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
          value={searchTerm}
          onChange={handleChange}
          placeholder="Поиск..."
          className={cls.input}
        />
      </form>
    </div>
  );
});
