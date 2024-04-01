import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetServicesByCategoryQuery } from "services/ServicesService";
import { ServiceCard } from "components/ServiceCard/ServiceCard";
import "swiper/scss";
import "./SimilarServices.scss";

interface SimilarServicesProps {
  categoryId: number;
  ServiceId: number;
}

export const SimilarServices = memo(
  ({ categoryId, ServiceId }: SimilarServicesProps) => {
    const { data: similarServices } = useGetServicesByCategoryQuery(categoryId);

    const filteredSimilarServices = similarServices?.filter(
      (service) => service.id !== ServiceId
    );

    return (
      <section className="SimilarServices">
        <p className="title">Похожие сервисы</p>
        <Swiper slidesPerView="auto" spaceBetween={8}>
          {filteredSimilarServices?.map((service) => (
            <SwiperSlide key={service.id}>
              <ServiceCard service={service} size="small" />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  }
);
