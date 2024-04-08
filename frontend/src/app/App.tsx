import { AppRouter } from "providers/router";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    localStorage.setItem("token", "9228db1e926465fd7e6dd5d7526dc072ad05132d");
  }, []);
  return (
    <div className="app">
      <AppRouter />
    </div>
  );
}

export default App;
