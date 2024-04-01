import { ReactElement, Ref, forwardRef, memo, useState } from "react";
import { Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Header } from "components/Header/Header";
import { ServicesList } from "components/ServicesList/ServicesList";
import { AllCategoriesDialog } from "components/AllCategoriesDialog/AllCategoriesDialog";
import {
  useGetFavoritesQuery,
  useGetNewServicesQuery,
  useGetServicesByCategoryQuery,
} from "services/ServicesService";
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

type Category = "Избранное" | "Новые" | "Все" | string;

type FlexDirection = "row" | "column";

interface CategoryDialogProps {
  name: string;
  logo: string;
  category?: Category;
  direction?: FlexDirection;
}

export const CategoryDialog = memo((props: CategoryDialogProps) => {
  const { name, logo, category, direction = "column" } = props;

  const [open, setOpen] = useState(false);

  const {
    data: favorites,
  } = useGetFavoritesQuery(undefined, {
    skip: category !== "Избранное",
  });

  const { data: news } = useGetNewServicesQuery(undefined, {
    skip: category !== "Новые",
  });

  const { data: byId } = useGetServicesByCategoryQuery(Number(category), {
    skip:
      category === "Избранное" || category === "Новые" || category === "Все",
    refetchOnMountOrArgChange: true,
  });

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
        style={{ flexDirection: direction }}
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
        <div className={cls.wrapper}>
          <div>
            <Header title={name} modal onCLick={handleClose} />
            {category === "Избранное" && (
              <ServicesList services={favorites || []} />
            )}
            {category === "Новые" && <ServicesList services={news || []} />}
            {category !== "Избранное" &&
              category !== "Новые" &&
              category !== "Все" && <ServicesList services={byId || []} />}
            {category === "Все" && <AllCategoriesDialog />}
          </div>
          {category !== "Все" && (
            <button
              type="button"
              className={cls.dialogCloseButton}
              onClick={handleClose}
            >
              На главную
            </button>
          )}
        </div>
      </Dialog>
    </>
  );
});
