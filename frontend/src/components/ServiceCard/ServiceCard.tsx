import { memo } from "react";
import { Link } from "react-router-dom";
import cls from "./ServiceCard.module.scss";

interface ServiceCardProps {
  logo: string;
  name: string;
  cashback: number;
  color: string;
}

export const ServiceCard = memo(
  ({ logo, name, cashback, color }: ServiceCardProps) => {
    return (
      <Link to={"/"} className={cls.ServiceCard} style={{ background: color }}>
        <div className={cls.innerContainer}>
          <img src={logo} alt="service logo" className={cls.logo} />
          <p className={cls.name}>{name}</p>
        </div>
        <p className={cls.cashback}>кешбэк {cashback}%</p>
      </Link>
    );
  }
);
