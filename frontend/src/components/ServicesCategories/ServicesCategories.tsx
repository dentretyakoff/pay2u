import { memo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "./ServicesCategories.scss";
import { dummyDataCategories } from "shared/data/dummyDataCategories";

interface ServicesCategoriesProps {}

export const ServicesCategories = memo(({}: ServicesCategoriesProps) => {
  const sllicedData = dummyDataCategories
    .slice(0, 7)
    .concat(dummyDataCategories.slice(-1));

  return (
    <div className="ServicesCategoriesWrapper">
      <h2 className="ServicesCategoriesTitle">Сервисы</h2>
      <Swiper slidesPerView="auto" spaceBetween={16}>
        {sllicedData.map((category) => (
          <SwiperSlide key={category.name}>
            <div className="ServicesCategoriesCard">
              <img
                src={category.url}
                alt="category logo"
                className="ServicesCategoriesLogo"
              />
              <p className="ServicesCategoriesName">{category.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});
