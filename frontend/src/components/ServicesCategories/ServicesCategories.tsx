import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetCategoriesQuery } from "services/CategoriesService";
import { CategoryDialog } from "components/CategoryDialog/CategoryDialog";
import favorites from "shared/assets/icons/favorites-icon.svg";
import news from "shared/assets/icons/new-icon.svg";
import all from "shared/assets/icons/all-icon.svg";
import "swiper/scss";
import "./ServicesCategories.scss";

interface ServicesCategoriesProps {}

export const ServicesCategories = memo(() => {
  const {
    data: categories = [],
    error = {},
    isFetching,
  } = useGetCategoriesQuery();

  const sllicedData = categories?.slice(0, 5);

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
          <CategoryDialog name="Все" logo={all} category="Все" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
});
