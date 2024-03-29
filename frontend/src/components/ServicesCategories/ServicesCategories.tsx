import { memo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetCategoriesQuery } from "services/CategoriesService";
import favorites from "shared/assets/icons/favorites-icon.svg";
import news from "shared/assets/icons/new-icon.svg";
import all from "shared/assets/icons/all-icon.svg";
import "swiper/scss";
import "./ServicesCategories.scss";
import { CategoryDialog } from "components/CategoryDialog/CategoryDialog";

interface ServicesCategoriesProps {}

export const ServicesCategories = memo(() => {
  const {
    data: categories = [],
    error = {},
    isFetching,
  } = useGetCategoriesQuery();

  const sllicedData = categories?.slice(0, 3).concat(categories.slice(-1));

  // const [open, setOpen] = useState(false);

  // const handleClick = () => {
  //   setOpen(!open);
  // };

  if ("status" in error) {
    return <div>{error.status}</div>;
  }

  return (
    <div className="ServicesCategoriesWrapper">
      <h2 className="ServicesCategoriesTitle">Сервисы</h2>
      <Swiper slidesPerView="auto" spaceBetween={16}>
        <SwiperSlide>
          <CategoryDialog
            name="Избранное"
            logo={favorites}
            category="Избранное"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CategoryDialog name="Новые" logo={news} category="Новые" />
        </SwiperSlide>
        {sllicedData?.map((category) => (
          <SwiperSlide key={category.id}>
            <CategoryDialog
              name={category.name}
              logo={category.image}
              category={String(category.id)}
            />
          </SwiperSlide>
        ))}
        <SwiperSlide>
          <div className="ServicesCategoriesCard">
            <img
              src={all}
              alt="category logo"
              className="ServicesCategoriesLogo"
            />
            <p className="ServicesCategoriesName">Все</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
});
