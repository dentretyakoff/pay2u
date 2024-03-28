import { memo } from "react";
import { Link } from "react-router-dom";
import { IMySubscription } from "models/IMySubscription";
import cls from "./ActiveServiceCard.module.scss";

interface ActiveServiceCardProps {
  // id: number;
  // logo: string;
  // name: string;
  // cashback: number;
  // color: string;
  // created?: string;
  // rating?: number;
  // category?: number;
  data: IMySubscription;
}

const localhost = "http://localhost:8000";

export const ActiveServiceCard = memo((props: ActiveServiceCardProps) => {
  // const { logo, name, cashback, color, id, category = 0, created = "", rating = 0 } = props;
  const { data: sub } = props;

  const date = new Date(sub.end_date).toLocaleDateString();

  return (
    <Link to={"/"} className={cls.ActiveServiceCard}>
      <div className={cls.innerContainer}>
        <img
          src={`${localhost}${sub.service_image}`}
          alt="logo"
          className={cls.logo}
        />
        <div className={cls.priceContainer}>
          <p className={cls.price}>{`${sub.subscription_price} RUB`}</p>
          <p className={cls.duaration}>за 1 месяц</p>
        </div>
      </div>
      <p className={cls.title}>{sub.service_name}</p>
      <p className={cls.option}>Тариф семейный</p>
      <p className={cls.endTime}>Действует до: {date}</p>
    </Link>
  );
});
