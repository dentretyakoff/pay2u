import { ReactElement, Ref, forwardRef, memo, useState } from "react";
import { Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Header } from "components/Header/Header";
import { ServicesList } from "components/ServicesList/ServicesList";
import cls from "./CategoryDialog.module.scss";

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement;
    },
    ref: Ref<unknown>
  ) => {
    return <Slide direction="left" ref={ref} {...props} />;
  }
);

interface CategoryDialogProps {
  name: string;
  logo: string;
}

export const CategoryDialog = memo((props: CategoryDialogProps) => {
  const { name, logo } = props;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClickOpen}
        className={cls.ServicesCategoriesCard}
      >
        <img
          src={logo}
          alt="category logo"
          className={cls.ServicesCategoriesLogo}
        />
        <p className={cls.ServicesCategoriesName}>{name}</p>
      </button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <div className={cls.header}>
          <Header title={name} modal onCLick={handleClose} />
          <ServicesList />
        </div>
      </Dialog>
    </>
  );
});
