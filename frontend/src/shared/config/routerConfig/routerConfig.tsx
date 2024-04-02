import { MainPage } from "pages/MainPage";
import { NotFoundPage } from "pages/NotFoundPage";
import { PurchasePage } from "pages/PurchasePage";
import { ServicePage } from "pages/ServicePage";
import { RouteProps } from "react-router-dom";

export enum AppRoutes {
  MAIN = "main",
  SERVICE_OVERVIEW = "service_overview",
  SUBSCRIPTION_PURCHASE = "subscription_purchase",
  //   ACTIVE_SERVICES = "active_services",
  //   ACTIVE_SERVICE_INFO = "active_service_info",

  // last
  NOT_FOUND = "not_found",
}

export const RouterPath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: "/",
  [AppRoutes.SERVICE_OVERVIEW]: "/services/:id",
  [AppRoutes.SUBSCRIPTION_PURCHASE]:
    "/services/:id/subscription/:subscriptionId",
  //   [AppRoutes.ACTIVE_SERVICES]: "/active_services",
  //   [AppRoutes.ACTIVE_SERVICE_INFO]: "/active_service_info",
  [AppRoutes.NOT_FOUND]: "*",
};

export const routerConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.MAIN]: {
    path: RouterPath.main,
    element: <MainPage />,
  },
  [AppRoutes.SERVICE_OVERVIEW]: {
    path: RouterPath.service_overview,
    element: <ServicePage />,
  },
  [AppRoutes.SUBSCRIPTION_PURCHASE]: {
    path: RouterPath.subscription_purchase,
    element: <PurchasePage />,
  },
  //   [AppRoutes.ACTIVE_SERVICES]: {
  //     path: RouterPath.active_services,
  //     element: <ActiveServicesPage />,
  //   },
  //   [AppRoutes.ACTIVE_SERVICE_INFO]: {
  //     path: RouterPath.active_service_info,
  //     element: <ActiveServiceInfoPage />,
  //   },
  [AppRoutes.NOT_FOUND]: {
    path: RouterPath.not_found,
    element: <NotFoundPage />,
  },
};
