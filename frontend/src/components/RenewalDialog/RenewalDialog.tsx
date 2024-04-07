import { forwardRef, memo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  useAddRenewalMutation,
  useDeleteRenewalMutation,
} from "services/MySubscriptions";
import cls from "./RenewalDialog.module.scss";

interface RenewalDialogProps {
  renewal: boolean;
  expireDate: Date;
  subscriptionId: string;
}

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

export const RenewalDialog = memo(
  ({ renewal, expireDate, subscriptionId }: RenewalDialogProps) => {
    const [addRenewal] = useAddRenewalMutation();
    const [deleteRenewal] = useDeleteRenewalMutation();
    const [open, setOpen] = useState(false);

    const date = new Date(expireDate).toLocaleDateString();

    const handleClickOpen = (): void => {
      setOpen(true);
    };

    const handleClose = (): void => {
      setOpen(false);
    };

    const handleCloseAgree = (): void => {
      if (renewal) {
        deleteRenewal(Number(subscriptionId));
      } else {
        addRenewal(Number(subscriptionId));
      }
      setOpen(false);
    };

    const onOff = renewal ? "Отключить" : "Включить";

    return (
      <>
        <button type="button" onClick={handleClickOpen} className={cls.button}>
          {onOff} автопродление
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
              display: "flex !important",
              alignItems: "flex-end",
            },
          }}
        >
          <div className={cls.dialogWrapper}>
            <p className={cls.top}>{onOff} автопродление подписки?</p>
            <p className={cls.expire}>Подписка будет действовать до {date}</p>
            <div className={cls.buttons}>
              {renewal ? (
                <>
                  <button
                    type="button"
                    className={cls.agreeBtn}
                    onClick={handleCloseAgree}
                  >
                    Отключить
                  </button>
                  <button
                    type="button"
                    className={cls.dialogCloseButton}
                    onClick={handleClose}
                  >
                    Не отключать
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={cls.agreeBtn}
                    onClick={handleClose}
                  >
                    Не включать
                  </button>
                  <button
                    type="button"
                    className={cls.dialogCloseButton}
                    onClick={handleCloseAgree}
                  >
                    Включить
                  </button>
                </>
              )}
            </div>
          </div>
        </Dialog>
      </>
    );
  }
);
