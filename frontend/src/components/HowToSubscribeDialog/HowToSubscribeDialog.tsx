import { forwardRef, memo, useState } from "react";
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Header } from "components/Header/Header";
import { useGetSeparateServiceQuery } from "services/ServicesService";
import steps from "shared/assets/pics/steps-svg.svg";
import cls from "./HowToSubscribeDialog.module.scss";

interface HowToSubscribeDialogProps {
  id: string;
}

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => {
    return <Slide direction="left" ref={ref} {...props} />;
  }
);

export const HowToSubscribeDialog = memo(
  ({ id }: HowToSubscribeDialogProps) => {
    const { data: service } = useGetSeparateServiceQuery(id || "");

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <button type="button" onClick={handleClickOpen} className={cls.button}>
          Как подключить?
        </button>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <div className={cls.dialogWrapper}>
            <Header modal onCLick={handleClose} title="" />
            <img
              src={service?.image_card}
              alt="service"
              className={cls.image}
            />
            <h2 className={cls.title}>Как подключить</h2>
            <div className={cls.content}>
              <img src={steps} alt="progress bar" />
              <ul className={cls.textList}>
                <li className={cls.text}>
                  Выберите подписку и тарифный план, подходящие именно вам
                </li>
                <li className={cls.text}>
                  Выберете счет, с которого хотите оплачивать подписку, для
                  автопродления включите функцию “Привязать счет”
                </li>
                <li className={cls.text}>
                  После успешной оплаты через СБП система сгенерирует код
                  доступа
                </li>
                <li className={cls.text}>
                  Активируйте подписку, введя промокод на сайте партнера.
                </li>
                <li className={cls.text}>
                  Получите кэшбек до 25 числа следующего за оплатой месяца
                </li>
              </ul>
            </div>
            <p className={cls.note}>
              Если вы уже подписаны на сервис, оплаченный период добавится к
              текущей подписке
            </p>
            <Link to="/" className={cls.link}>
              Остались вопросы? Напишите нам
            </Link>
          </div>
        </Dialog>
      </>
    );
  }
);
