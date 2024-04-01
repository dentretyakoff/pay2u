import { Suspense, memo } from "react";
import { useParams } from "react-router-dom";
import { useGetSeparateServiceQuery } from "services/ServicesService";
import { Header } from "components/Header/Header";
import { HowToSubscribeDialog } from "components/HowToSubscribeDialog/HowToSubscribeDialog";
import { Loader } from "widgets/Loader/Loader";
import { SubscriptionPlans } from "components/SubscriptionPlans/SubscriptionPlans";
import { SimilarServices } from "components/SimilarServices/SimilarServices";
import cls from "./ServicePage.module.scss";

interface ServicePageProps {}

const ServicePage = memo(() => {
  const { id } = useParams();
  const { data: service } = useGetSeparateServiceQuery(id || "");

  console.log(service);

  return (
    <Suspense fallback={<Loader />}>
      <main className={cls.ServicePage}>
        <Header path="/" title="" />
        <img src={service?.image_card} alt="service" className={cls.image} />
        <h1 className={cls.title}>{service?.name}</h1>
        <p className={cls.description}>{service?.description}</p>
        <HowToSubscribeDialog id={id || ""} />
        <SubscriptionPlans plans={service?.subscriptions || []} />
        <SimilarServices categoryId={service?.category || 0} ServiceId={service?.id || 0} />
      </main>
    </Suspense>
  );
});

export default ServicePage;
