import { memo } from "react";
import { ServiceCard } from "components/ServiceCard/ServiceCard";
import cls from "./ServicesList.module.scss";

interface ServicesListProps {}

export const ServicesList = memo(({}: ServicesListProps) => {
  return (
    <section className={cls.ServicesListWrapper}>
      {Array.from({ length: 10 }).map((_, index) => (
        <ServiceCard
          key={index}
          name="Ivi"
          cashback={10}
          logo="https://cdn.cssauthor.com/wp-content/uploads/2012/12/accelrys1.png?strip=all&lossy=1&resize=730%2C500&ssl=1"
          color="#F30745"
        />
      ))}
    </section>
  );
});
