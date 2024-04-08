import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "./SliderOnboarding.scss";

interface SliderOnboardingData {
  title: string;
  text: string;
  color: string;
}

interface SliderOnboardingProps {
  slidesData: SliderOnboardingData[];
}

export const SliderOnboarding = memo(
  ({ slidesData }: SliderOnboardingProps) => {
    return (
      <div className="SliderOnboardingWrapper">
        <Swiper spaceBetween={16} slidesPerView="auto" className="swiper">
          {slidesData.map((slide) => (
            <SwiperSlide key={slide.text}>
              <div
                style={{
                  width: 253,
                  height: 97,
                  borderRadius: 12,
                  padding: 8,
                  backgroundColor: slide.color,
                }}
              >
                <h3 className="sliderOnboardingTitle">{slide.title}</h3>
                <p className="sliderOnboardingText">{slide.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }
);
