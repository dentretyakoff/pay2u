import { memo } from "react";
import { Link } from "react-router-dom";
import { ISubscription } from "models/IService";
import { getWordEnding } from "shared/lib/getWordEnding";
import cls from "./SubscriptionPlanCard.module.scss";

interface SubscriptionPlanCardProps {
  plan: ISubscription;
}

export const SubscriptionPlanCard = memo(
  ({ plan }: SubscriptionPlanCardProps) => {
    const perMonth = plan.price / plan.months;
    const wordEnding = getWordEnding(plan.months, "месяц");

    return (
      <div className={cls.SubscriptionPlanCard}>
        <div className={cls.topLine}>
          <p className={cls.title}>{plan.name} </p>
          <p className={cls.cashback}>кешбэк {plan.cashback}%</p>
        </div>
        <p className={cls.price}>
          <span>{perMonth}₽ </span>в месяц
        </p>
        {plan.months > 1 && (
          <p className={cls.fullPrice}>
            при оплате {plan.price} ₽ раз в {plan.months} {wordEnding}
          </p>
        )}
        <Link
          to={`/services/${plan.service}/subscription/${plan.id}`}
          className={cls.button}
        >
          Подключить
        </Link>
      </div>
    );
  }
);
