import { memo } from "react";
import { SubscriptionPlanCard } from "components/SubscriptionPlanCard/SubscriptionPlanCard";
import { ISubscription } from "models/IService";
import cls from "./SubscriptionPlans.module.scss";

interface SubscriptionPlansProps {
  plans: ISubscription[];
}

export const SubscriptionPlans = memo(({ plans }: SubscriptionPlansProps) => {
  return (
    <section className={cls.SubscriptionPlans}>
      <p className={cls.text}>Доступные планы :</p>
      <div className={cls.plans}>
        {plans.length ? (
          plans.map((plan) => (
            <SubscriptionPlanCard key={plan.id} plan={plan} />
          ))
        ) : (
          <p className={cls.noData}>Нет доступных планов</p>
        )}
      </div>
    </section>
  );
});
