import { Suspense, memo, useCallback } from "react";
import { Route, RouteProps, Routes } from "react-router-dom";
import { routerConfig } from "shared/config/routerConfig/routerConfig";
import { Loader } from "widgets/Loader/Loader";

const AppRouter = () => {
  const renderWithWrapper = useCallback((route: RouteProps) => {
    const element = <div style={{ flexGrow: 1 }}>{route.element}</div>;

    return <Route key={route.path} path={route.path} element={element} />;
  }, []);
  return (
    <Suspense fallback={<Loader />}>
      <Routes>{Object.values(routerConfig).map(renderWithWrapper)}</Routes>
    </Suspense>
  );
};

export default memo(AppRouter);
