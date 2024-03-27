import { memo } from "react";
import { Link } from "react-router-dom";
import logo from "../../shared/assets/pics/test-logo.png";
import cls from "./ActiveServiceCard.module.scss";

interface ActiveServiceCardProps {}

export const ActiveServiceCard = memo(({}: ActiveServiceCardProps) => {
  return (
    <Link to={"/"} className={cls.ActiveServiceCard}>
      <div className={cls.innerContainer}>
        <img src={logo} alt="logo" className={cls.logo} />
        <div className={cls.priceContainer}>
          <p className={cls.price}>200 RUB</p>
          <p className={cls.duaration}>за 1 месяц</p>
        </div>
      </div>
      <p className={cls.title}>Ivi</p>
      <p className={cls.option}>Тариф семейный</p>
      <p className={cls.endTime}>Действует до: 16.05.2024</p>
    </Link>
  );
});
