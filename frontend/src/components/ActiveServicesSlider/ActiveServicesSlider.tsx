import { memo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { ActiveServiceCard } from "components/ActiveServiceCard/ActiveServiceCard";
import "swiper/scss";
import "./ActiveServicesSlider.scss";

interface ActiveServicesSliderProps {}

export const ActiveServicesSlider = memo(({}: ActiveServicesSliderProps) => {
  return (
    <section className="ActiveServicesSliderWrapper">
      <div className="ActiveServicesSliderTitleContainer">
        <h2 className="ActiveServicesSliderTitle">Мои подключенные сервисы</h2>
        <Link to={"/"} className="ActiveServicesSliderLink">
          Все
        </Link>
      </div>
      <Swiper slidesPerView={"auto"} spaceBetween={8}>
        <SwiperSlide>
          <ActiveServiceCard />
        </SwiperSlide>
        <SwiperSlide>
          <ActiveServiceCard />
        </SwiperSlide>
        <SwiperSlide>
          <ActiveServiceCard />
        </SwiperSlide>
        <SwiperSlide>
          <ActiveServiceCard />
        </SwiperSlide>
      </Swiper>
    </section>
  );
});
