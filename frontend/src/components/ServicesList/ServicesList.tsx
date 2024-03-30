import { memo } from "react";
import { ServiceCard } from "components/ServiceCard/ServiceCard";
import { IService } from "models/IService";
import noServicesLogo from "shared/assets/icons/error-svg.svg";
import cls from "./ServicesList.module.scss";

interface ServicesListProps {
  services: IService[];
}

export const ServicesList = memo(({ services }: ServicesListProps) => {
  if (!services.length) {
    return (
      <div className={cls.noServicesWrapper}>
        <img
          src={noServicesLogo}
          alt="no services"
          className={cls.noServicesLogo}
        />
        <p className={cls.noServices}>Нет доступных сервисов</p>
      </div>
    );
  }

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
