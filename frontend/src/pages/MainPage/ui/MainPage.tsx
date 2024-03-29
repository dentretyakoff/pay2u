import { ActiveServicesSlider } from "components/ActiveServicesSlider/ActiveServicesSlider";
import { Header } from "components/Header/Header";
import { OnboardingDialog } from "components/OnboardingDialog/OnboardingDialog";
import { SearchBar } from "components/SearchBar/SearchBar";
import { ServicesCategories } from "components/ServicesCategories/ServicesCategories";
import { ServicesList } from "components/ServicesList/ServicesList";
import { SliderOnboarding } from "components/SliderOnboarding/SliderOnboarding";
import { useEffect } from "react";
import { useGetCategoriesQuery } from "services/CategoriesService";
import { useGetServicesQuery } from "services/ServicesService";
import { sliderOnboardingData } from "shared/data/sliderOnboarding";

const MainPage = () => {
  useEffect(() => {
    localStorage.setItem("token", "9228db1e926465fd7e6dd5d7526dc072ad05132d");
  }, [])

  // const { data, error, isFetching } = useGetCategoriesQuery();
  // if (data) {
  //   console.log(data);
  // }
  // fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
  //   res.json().then((data) => console.log(data))
  // );
  const { data: services = [], error, isFetching } = useGetServicesQuery();

  return (
    <main>
      <Header path="/" title="Развлекательные сервисы" />
      <SearchBar onSearch={() => {}} />
      <SliderOnboarding slidesData={sliderOnboardingData} />
      <OnboardingDialog />
      <ActiveServicesSlider />
      <ServicesCategories />
      <ServicesList services={services}/>
    </main>
  );
};

export default MainPage;
