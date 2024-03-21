import { Header } from "../../../components/Header/Header";
import { SearchBar } from "../../../components/SearchBar/SearchBar";

const MainPage = () => {
  return (
    <main>
      <Header path="/" title="Развлекательные сервисы" />
      <SearchBar onSearch={() => {}} />
    </main>
  );
};

export default MainPage;
