import { Suspense, memo } from "react";
import { useParams } from "react-router-dom";
import {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetSeparateServiceQuery,
} from "services/ServicesService";
import { Header } from "components/Header/Header";
import { HowToSubscribeDialog } from "components/HowToSubscribeDialog/HowToSubscribeDialog";
import { Loader } from "widgets/Loader/Loader";
import { SubscriptionPlans } from "components/SubscriptionPlans/SubscriptionPlans";
import { SimilarServices } from "components/SimilarServices/SimilarServices";
import heartEmpty from "shared/assets/icons/heart-inactive.svg";
import heartFill from "shared/assets/icons/Vector2.png";
import cls from "./ServicePage.module.scss";

const ServicePage = memo(() => {
  const { id } = useParams();
  const { data: service } = useGetSeparateServiceQuery(id || "");

  const [addFavorite] = useAddFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();

  const handleAddFavorite = () => {
    addFavorite(service?.id || 0);
  };

  const handleDeleteFavorite = () => {
    deleteFavorite(service?.id || 0);
  };

  const handleAddDeleteFavorite = () => {
    if (service?.is_favorited) {
      handleDeleteFavorite();
    } else {
      handleAddFavorite();
    }
  };

  return (
    <Suspense fallback={<Loader />}>
      <main className={cls.ServicePage}>
        <Header path="/" title="" />
        <div className={cls.imageContainer}>
          <div className={cls.positionContainer}>
            <img
              src={service?.image_card}
              alt="service"
              className={cls.image}
            />
            <button
              type="button"
              onClick={handleAddDeleteFavorite}
              className={cls.like}
            >
              <img
                src={service?.is_favorited ? heartFill : heartEmpty}
                alt="heart"
              />
            </button>
          </div>
        </div>
        <h1 className={cls.title}>{service?.name}</h1>
        <p className={cls.description}>{service?.description}</p>
        <HowToSubscribeDialog id={id || ""} />
        <SubscriptionPlans plans={service?.subscriptions || []} />
        <SimilarServices
          categoryId={service?.category || 0}
          ServiceId={service?.id || 0}
        />
      </main>
    </Suspense>
  );
});

export default ServicePage;
