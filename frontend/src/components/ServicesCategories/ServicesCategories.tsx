import { memo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "./ServicesCategories.scss";
import { useGetCategoriesQuery } from "services/CategoriesService";

interface ServicesCategoriesProps {}

export const ServicesCategories = memo(() => {
  const { data: categories, error, isFetching } = useGetCategoriesQuery();
  console.log(categories);

  const sllicedData = categories.slice(0, 7).concat(categories.slice(-1));

  if (error) {
    return <div>{error.status}</div>;
  }

  return (
    <div className="ServicesCategoriesWrapper">
      <h2 className="ServicesCategoriesTitle">Сервисы</h2>
      <Swiper slidesPerView="auto" spaceBetween={16}>
        {sllicedData.map((category) => (
          <SwiperSlide key={category.id}>
            <div className="ServicesCategoriesCard">
              <img
                src={category.image}
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
