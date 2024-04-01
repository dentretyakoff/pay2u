import { memo } from "react";
import { Link } from "react-router-dom";
import { ISubscription } from "models/IService";
import cls from "./SubscriptionPlanCard.module.scss";

interface SubscriptionPlanCardProps {
  plan: ISubscription;
}

export const SubscriptionPlanCard = memo(
  ({ plan }: SubscriptionPlanCardProps) => {
    return (
      <div className={cls.SubscriptionPlanCard}>
        <div className={cls.topLine}>
          <p className={cls.title}>{plan.name} </p>
          <p className={cls.cashback}>кешбэк {plan.cashback}%</p>
        </div>
        <p className={cls.price}>
          <span>{plan.price}₽ </span>в месяц
        </p>
        <Link to="/" className={cls.button}>
          Подключить
        </Link>
      </div>
    );
  }
);
