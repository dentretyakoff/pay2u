import { memo } from "react";
import { Link } from "react-router-dom";
import cls from "./ServiceCard.module.scss";

interface ServiceCardProps {
  id: number;
  logo: string;
  name: string;
  cashback: number;
  color: string;
  created?: string;
  rating?: number;
  category?: number;
}

export const ServiceCard = memo((props: ServiceCardProps) => {
  const {
    logo,
    name,
    cashback,
    color,
    id,
    category = 0,
    created = "",
    rating = 0,
  } = props;
  return (
    <Link to={`/services/${id}`} className={cls.ServiceCard} style={{ background: color }}>
      <div className={cls.innerContainer}>
        <img src={logo} alt="service logo" className={cls.logo} />
        <p className={cls.name}>{name}</p>
      </div>
      <p className={cls.cashback}>кешбэк {cashback}%</p>
    </Link>
  );
});
