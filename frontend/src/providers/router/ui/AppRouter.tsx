import { memo, useCallback } from "react";
import { Route, RouteProps, Routes } from "react-router-dom";
import { routerConfig } from "shared/config/routerConfig/routerConfig";

const AppRouter = () => {
  const renderWithWrapper = useCallback((route: RouteProps) => {
    const element = <div style={{ flexGrow: 1 }}>{route.element}</div>;

    return <Route key={route.path} path={route.path} element={element} />;
  }, []);
  return <Routes>{Object.values(routerConfig).map(renderWithWrapper)}</Routes>;
};

export default memo(AppRouter);
