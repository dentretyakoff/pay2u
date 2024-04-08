import { forwardRef, memo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import steps from "shared/assets/pics/steps-svg.svg";
import cls from "./PurchaseGuideDialog.module.scss";

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export const PurchaseGuideDialog = memo(() => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <button type="button" onClick={handleClickOpen} className={cls.button}>
        Как это работает?
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            margin: 0,
            width: "100%",
            borderRadius: "12px 12px 0px 0px",
          },
          "& .MuiDialog-container": {
            display: "block !important",
            marginTop: "190px",
          },
        }}
      >
        <div className={cls.dialogWrapper}>
          <p className={cls.top}>КАК ПОДКЛЮЧИТЬ</p>
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
                После успешной оплаты через СБП система сгенерирует код доступа
              </li>
              <li className={cls.text}>
                Активируйте подписку, введя промокод на сайте партнера.
              </li>
              <li className={cls.text}>
                Получите кэшбек до 25 числа следующего за оплатой месяца
              </li>
            </ul>
          </div>
          <button
            type="button"
            className={cls.dialogCloseButton}
            onClick={handleClose}
          >
            Понятно
          </button>
        </div>
      </Dialog>
    </>
  );
});
