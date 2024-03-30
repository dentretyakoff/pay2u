import { memo } from "react";
import { useGetCategoriesQuery } from "services/CategoriesService";
import { CategoryDialog } from "components/CategoryDialog/CategoryDialog";
import favorites from "shared/assets/icons/favorites-icon.svg";
import news from "shared/assets/icons/new-icon.svg";
import cls from "./AllCategoriesDialog.module.scss";

export const AllCategoriesDialog = memo(() => {
  const { data: categories = [] } = useGetCategoriesQuery();
  return (
    <div className={cls.wrapper}>
      <CategoryDialog name="Избранное" logo={favorites} category="Избранное" direction="row" />
      <CategoryDialog name="Новые" logo={news} category="Новые" direction="row" />
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
