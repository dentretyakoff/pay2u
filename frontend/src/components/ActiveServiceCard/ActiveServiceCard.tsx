import { memo } from "react";
import { Link } from "react-router-dom";
import { IMySubscription } from "models/IMySubscription";
import { getWordEnding } from "shared/lib/getWordEnding";
import cls from "./ActiveServiceCard.module.scss";

interface ActiveServiceCardProps {
  data: IMySubscription;
}

export const ActiveServiceCard = memo((props: ActiveServiceCardProps) => {
  const { data: sub } = props;

  const date = new Date(sub.end_date).toLocaleDateString();

  const wordEnding = getWordEnding(sub.subscription_months, "месяц");

  return (
    <Link to={"/"} className={cls.ActiveServiceCard}>
      <div className={cls.innerContainer}>
        <img
          src={sub.service_image}
          alt="logo"
          className={cls.logo}
        />
        <div className={cls.priceContainer}>
          <p className={cls.price}>{`${sub.subscription_price} RUB`}</p>
          <p className={cls.duaration}>за {sub.subscription_months} {wordEnding}</p>
        </div>
      </div>
      <p className={cls.title}>{sub.service_name}</p>
      <p className={cls.option}>{sub.subscription_name}</p>
      <p className={cls.endTime}>Действует до: {date}</p>
    </Link>
  );
});
