import { ActiveServicesSlider } from "components/ActiveServicesSlider/ActiveServicesSlider";
import { Header } from "components/Header/Header";
import { OnboardingDialog } from "components/OnboardingDialog/OnboardingDialog";
import { SearchBar } from "components/SearchBar/SearchBar";
import { ServicesCategories } from "components/ServicesCategories/ServicesCategories";
import { ServicesList } from "components/ServicesList/ServicesList";
import { SliderOnboarding } from "components/SliderOnboarding/SliderOnboarding";
import { useEffect } from "react";
import {
  useGetFindServicesQuery,
  useGetServicesQuery,
} from "services/ServicesService";
import { sliderOnboardingData } from "shared/data/sliderOnboarding";
import { useAppSelector } from "shared/hooks/redux";

const MainPage = () => {
  const query = useAppSelector((state) => state.search.query);
  useEffect(() => {
    localStorage.setItem("token", "9228db1e926465fd7e6dd5d7526dc072ad05132d");
  }, []);

  const {
    data: searchResults,
    // isFetching: searchFetching,
  } = useGetFindServicesQuery(query, { skip: query === "" });

  const { data: allServices = [],
    // error,
    // isFetching
  } = useGetServicesQuery();

  const servicesList = !query ? allServices : searchResults;

  return (
    <main>
      <Header path="/" title="Развлекательные сервисы" />
      <SearchBar />
      {!query && (
        <>
          <SliderOnboarding slidesData={sliderOnboardingData} />
          <OnboardingDialog />
          <ActiveServicesSlider />
          <ServicesCategories />
        </>
      )}
      <ServicesList services={servicesList || []} />
    </main>
  );
};

export default MainPage;
