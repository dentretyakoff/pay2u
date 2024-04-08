import { memo } from "react";
import { IMySubscription } from "models/IMySubscription";
import { Divider } from "@mui/material";
import sbp from "shared/assets/icons/logo-sbp.svg";
import cls from "./InfoList.module.scss";

interface InfoListProps {
  info: IMySubscription;
}

export const InfoList = memo(({ info }: InfoListProps) => {
  const date = new Date(info.end_date).toLocaleDateString();
  return (
    <section className={cls.InfoList}>
      <p className={cls.title}>{info.subscription_name}</p>
      <div className={cls.field}>
        <p>Стоимость подписки</p>
        <p>{`${info.subscription_price} ₽`}</p>
      </div>
      <Divider />
      <div className={cls.field}>
        <p>Следующее списание</p>
        <p>{date}</p>
      </div>
      <Divider />
      <div className={cls.field}>
        <p>Счет списания</p>
        <img src={sbp} alt="sbp" />
      </div>
      <Divider />
      <div className={cls.field}>
        <p>Номер телефона</p>
        <a href="tel:89009999999">+ 7 (900) 999-99-99</a>
      </div>
    </section>
  );
});
