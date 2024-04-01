import { memo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { ActiveServiceCard } from "components/ActiveServiceCard/ActiveServiceCard";
import { useGetMySubscriptionsQuery } from "services/MySubscriptions";
import "swiper/scss";
import "./ActiveServicesSlider.scss";

export const ActiveServicesSlider = memo(() => {
  const { data: userSubs, error, isFetching } = useGetMySubscriptionsQuery();

  return (
    <section className="ActiveServicesSliderWrapper">
      <div className="ActiveServicesSliderTitleContainer">
        <h2 className="ActiveServicesSliderTitle">Мои подключенные сервисы</h2>
        <Link to={"/"} className="ActiveServicesSliderLink">
          Все
        </Link>
      </div>
      <Swiper slidesPerView="auto" spaceBetween={8}>
        {userSubs?.map((sub) => (
          <SwiperSlide key={sub.id}>
            <ActiveServiceCard
              data={sub}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
});
