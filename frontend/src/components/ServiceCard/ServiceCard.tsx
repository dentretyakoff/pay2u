import { memo } from "react";
import { Link } from "react-router-dom";
import { IService } from "models/IService";
import cls from "./ServiceCard.module.scss";

interface ServiceCardProps {
  service: IService;
  size?: "small" | "regular";
}

export const ServiceCard = memo((props: ServiceCardProps) => {
  const {
    service: { id, image, name, cashback, color },
    size = "regular",
  } = props;

  const regular = size === "regular";

  return (
    <Link
      to={`/services/${id}`}
      className={regular ? cls.ServiceCard : cls.ServiceCardSmall}
      style={{ background: color }}
    >
      <div className={cls.innerContainer}>
        <img src={image} alt="service logo" className={regular ? cls.logo : cls.logoSmall} />
        <p className={cls.name}>{name}</p>
      </div>
      <p className={regular ? cls.cashback : cls.cashbackSmall}>
        кешбэк {cashback}%
      </p>
    </Link>
  );
});
