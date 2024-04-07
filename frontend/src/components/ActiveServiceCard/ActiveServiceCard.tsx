import { memo } from "react";
import { Link } from "react-router-dom";
import { IMySubscription } from "models/IMySubscription";
import { getWordEnding } from "shared/lib/getWordEnding";
import cls from "./ActiveServiceCard.module.scss";

interface ActiveServiceCardProps {
  data: IMySubscription;
  homepage?: boolean;
  inactive?: boolean;
}

export const ActiveServiceCard = memo((props: ActiveServiceCardProps) => {
  const { data: sub, homepage = false, inactive = false } = props;

  const date = new Date(sub.end_date).toLocaleDateString();

  const wordEnding = getWordEnding(sub.subscription_months, "месяц");

  return (
    <Link
      to={`/my-subscriptions/${sub.id}`}
      className={homepage ? cls.ActiveServiceCardHome : cls.ActiveServiceCard}
      style={{ background: homepage ? "none" : sub.service_color }}
    >
      {homepage ? (
        <>
          <div className={cls.innerContainer}>
            <img src={sub.service_image} alt="logo" className={cls.logo} />
            <div className={cls.priceContainer}>
              <p className={cls.priceHome}>{`${sub.subscription_price} ₽`}</p>
              <p className={cls.duarationHome}>
                за {sub.subscription_months} {wordEnding}
              </p>
            </div>
          </div>
          <p className={cls.title}>{sub.service_name}</p>
          <p className={cls.option}>{sub.subscription_name}</p>
          <p className={cls.endTimeHome}>{inactive ? "Срок действия истек:" : "Действует до:"} {date}</p>
        </>
      ) : (
        <>
          <div className={cls.logoNameContainer}>
            <img src={sub.service_image} alt="logo" className={cls.logo} />
            <div className={cls.infoContainer}>
              <p className={cls.title}>{sub.service_name}</p>
              <p className={cls.option}>{sub.subscription_name}</p>
              <p className={cls.endTime}>Действует до: {date}</p>
            </div>
          </div>
          <div className={cls.priceContainer}>
            <p className={cls.price}>{`${sub.subscription_price} ₽`}</p>
            <p className={cls.duaration}>
              за {sub.subscription_months} {wordEnding}
            </p>
          </div>
        </>
      )}
    </Link>
  );
});
