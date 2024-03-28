import { memo } from "react";
import { ServiceCard } from "components/ServiceCard/ServiceCard";
import { useGetServicesQuery } from "services/ServicesService";
import cls from "./ServicesList.module.scss";

interface ServicesListProps {}

export const ServicesList = memo(() => {
  const { data: services = [], error, isFetching } = useGetServicesQuery();
  return (
    <section className={cls.ServicesListWrapper}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          id={service.id}
          logo={service.image}
          name={service.name}
          cashback={service.cashback}
          color={service.color}
        />
      ))}
    </section>
  );
});
