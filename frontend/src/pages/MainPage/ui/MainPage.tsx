import { ActiveServiceCard } from "components/ActiveServiceCard/ActiveServiceCard";
import { Header } from "components/Header/Header";
import { OnboardingDialog } from "components/OnboardingDialog/OnboardingDialog";
import { SearchBar } from "components/SearchBar/SearchBar";
import { SliderOnboarding } from "components/SliderOnboarding/SliderOnboarding";
import { sliderOnboardingData } from "shared/data/sliderOnboarding";

const MainPage = () => {
  return (
    <main>
      <Header path="/" title="Развлекательные сервисы" />
      <SearchBar onSearch={() => {}} />
      <SliderOnboarding slidesData={sliderOnboardingData} />
      <OnboardingDialog />
      <ActiveServiceCard />
    </main>
  );
};

export default MainPage;
