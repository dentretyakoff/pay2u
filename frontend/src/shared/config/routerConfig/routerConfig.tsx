import { MainPage } from "pages/MainPage";
import { MySubscriptionsPage } from "pages/MySubscriptionsPage";
import { NotFoundPage } from "pages/NotFoundPage";
import { PurchasePage } from "pages/PurchasePage";
import { ServicePage } from "pages/ServicePage";
import { SubscriptionPage } from "pages/SubscriptionPage";
import { RouteProps } from "react-router-dom";

export enum AppRoutes {
  MAIN = "main",
  SERVICE_OVERVIEW = "service_overview",
  SUBSCRIPTION_PURCHASE = "subscription_purchase",
  MY_SUBSCRIPTIONS = "my_subscriptions",
  SUBSCRIPTION_INFO = "subscription_info",

  // last
  NOT_FOUND = "not_found",
}

export const RouterPath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: "/",
  [AppRoutes.SERVICE_OVERVIEW]: "/services/:id",
  [AppRoutes.SUBSCRIPTION_PURCHASE]:
    "/services/:id/subscription/:subscriptionId",
  [AppRoutes.MY_SUBSCRIPTIONS]: "/my-subscriptions",
  [AppRoutes.SUBSCRIPTION_INFO]: "/my-subscriptions/:subscriptionId",
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
  [AppRoutes.MY_SUBSCRIPTIONS]: {
    path: RouterPath.my_subscriptions,
    element: <MySubscriptionsPage />,
  },
  [AppRoutes.SUBSCRIPTION_INFO]: {
    path: RouterPath.subscription_info,
    element: <SubscriptionPage />,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RouterPath.not_found,
    element: <NotFoundPage />,
  },
};
