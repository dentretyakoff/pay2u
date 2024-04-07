import { Suspense, memo } from "react";
import { Loader } from "widgets/Loader/Loader";
import { Header } from "components/Header/Header";
import { useGetMySubscriptionQuery } from "services/MySubscriptions";
import { useParams } from "react-router-dom";
import { InfoList } from "components/InfoList/InfoList";
import { RenewalDialog } from "components/RenewalDialog/RenewalDialog";
import cls from "./SubscriptionPage.module.scss";

const SubscriptionPage = memo(() => {
  const { subscriptionId } = useParams();
  const { data: subscription } = useGetMySubscriptionQuery(
    Number(subscriptionId) || 0
  );
  return (
    <Suspense fallback={<Loader />}>
      <main className={cls.SubscriptionPage}>
        <Header path="/my-subscriptions" title="Моя подписка" />
        <div className={cls.title}>
          <img src={subscription?.service_image} alt="logo" />
          <h2>{subscription?.service_name}</h2>
        </div>
        {subscription && <InfoList info={subscription} />}
        <a href="/" className={cls.link}>
          Ссылка на сервис
        </a>
        <a href="/" className={cls.link}>
          Инструкция по работе с сервисом
        </a>
        {subscription && (
          <RenewalDialog
            renewal={subscription?.renewal_status}
            expireDate={subscription?.end_date}
            subscriptionId={subscriptionId || ""}
          />
        )}
      </main>
    </Suspense>
  );
});

export default SubscriptionPage;
