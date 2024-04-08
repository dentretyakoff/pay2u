import { ReactElement, Ref, forwardRef, memo, useState } from "react";
import { Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import StoriesPic1 from "shared/assets/pics/stories-pic1.png";
import StoriesPic2 from "shared/assets/pics/stories-pic2.png";
import HomeIcon from "shared/assets/icons/home-icon.svg";
import PhoneIcon from "shared/assets/icons/phone-icon.svg";
import RubleIcon from "shared/assets/icons/ruble-icon.svg";
import CloseButton from "shared/assets/icons/close-btn.svg";
import "./OnboardingDialog.scss";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement;
    },
    ref: Ref<unknown>
  ) => {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

interface OnboardingDialogProps {}

export const OnboardingDialog = memo((props: OnboardingDialogProps) => {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="OnboarfingDialogWrapper">
      <button className="dialogButton" type="button" onClick={handleOpen}>
        Как это работает?
      </button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <button
          type="button"
          className="dialogCloseButton"
          onClick={handleClose}
        >
          <img src={CloseButton} alt="close button" />
        </button>
        <Swiper
          navigation
          pagination
          modules={[Pagination, Navigation]}
          slidesPerView={1}
          className="OnboardingDialogSlider"
        >
          <SwiperSlide className="dialogSlide">
            <img src={StoriesPic1} alt="party" className="dialogImg" />
            <p className="dialogTitle">Платите меньше</p>
            <p className="dialogText">
              Подписывайтесь на специальных условиях и получайте от 10% кешбэка
              с каждой оплаты
            </p>
          </SwiperSlide>
          <SwiperSlide className="dialogSlide">
            <p className="dialogTitle">
              Управляйте всеми подписками в одном приложении
            </p>
            <ul className="dialogTextList">
              <li className="dialogTextListItem">
                <img src={HomeIcon} alt="icon" className="dialogTextListIcon" />
                <p className="dialogText">
                  Новые подписки без привязки карты в сервисе
                </p>
              </li>
              <li className="dialogTextListItem">
                <img
                  src={PhoneIcon}
                  alt="icon"
                  className="dialogTextListIcon"
                />
                <p className="dialogText">Легко отключайте ненужные подписки</p>
              </li>
              <li className="dialogTextListItem">
                <img
                  src={RubleIcon}
                  alt="icon"
                  className="dialogTextListIcon"
                />
                <p className="dialogText">Контролируйте списания с карты</p>
              </li>
            </ul>
          </SwiperSlide>
          <SwiperSlide className="dialogSlide">
            <img src={StoriesPic2} alt="party" className="dialogImg" />
            <p className="dialogTitle">Защитите свои платежные данные</p>
            <p className="dialogText">
              Все данные вашей карты остаются в банке и не передаются в
              сторонние сервисы
            </p>
            <button
              type="button"
              className="dialogBackButton"
              onClick={handleClose}
            >
              На главную
            </button>
          </SwiperSlide>
        </Swiper>
      </Dialog>
    </div>
  );
});
