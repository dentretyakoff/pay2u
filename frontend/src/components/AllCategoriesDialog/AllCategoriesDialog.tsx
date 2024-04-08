import { memo } from "react";
import { useGetCategoriesQuery } from "services/CategoriesService";
import {
  useGetFavoritesQuery,
  useGetNewServicesQuery,
} from "services/ServicesService";
import { CategoryDialog } from "components/CategoryDialog/CategoryDialog";
import favoritesIcon from "shared/assets/icons/favorites-icon.svg";
import newsIcon from "shared/assets/icons/new-icon.svg";
import cls from "./AllCategoriesDialog.module.scss";

export const AllCategoriesDialog = memo(() => {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: favorite = [] } = useGetFavoritesQuery();
  const { data: news = [] } = useGetNewServicesQuery();

  return (
    <div className={cls.wrapper}>
      <div className={cls.category}>
        <CategoryDialog
          name="Избранное"
          logo={favoritesIcon}
          category="Избранное"
          direction="row"
        />
        <p
          className={cls.counter}
          style={{ display: favorite?.length ? "block" : "none" }}
        >
          {favorite?.length}
        </p>
      </div>
      <div className={cls.category}>
        <CategoryDialog
          name="Новые"
          logo={newsIcon}
          category="Новые"
          direction="row"
        />
        <p
          className={cls.counter}
          style={{ display: news?.length ? "block" : "none" }}
        >
          {news?.length}
        </p>
      </div>
      {categories?.map((category) => (
        <div key={category.id} className={cls.category}>
          <CategoryDialog
            name={category.name}
            logo={category.image}
            category={String(category.id)}
            direction="row"
          />
          <p
            className={cls.counter}
            style={{ display: category.services_count ? "block" : "none" }}
          >
            {category.services_count}
          </p>
        </div>
      ))}
    </div>
  );
});
